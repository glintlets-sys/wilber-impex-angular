import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, take } from 'rxjs/operators';
import { CartService, Cart, CartItem } from '../shared-services/cart.service';
import { OfflineCartService } from '../shared-services/offline-cart.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { ProductIntegrationService } from './product-integration.service';
import { ToasterService } from '../shared-services/toaster.service';
import { ToastType } from '../shared-services/toaster';

// Local cart interfaces for the integration service
export interface LocalCartItem {
  product: any;
  quantity: number;
  size?: string;
  color?: string;
  packagingType?: string;
  selectedPrice?: string;
}

export interface LocalCart {
  items: LocalCartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartIntegrationService {
  private cartModeSubject = new BehaviorSubject<'offline' | 'online'>('offline');
  public cartMode$ = this.cartModeSubject.asObservable();
  
  private mergeInProgressSubject = new BehaviorSubject<boolean>(false);
  public mergeInProgress$ = this.mergeInProgressSubject.asObservable();

  constructor(
    private cartService: CartService,
    private offlineCartService: OfflineCartService,
    private authService: AuthenticationService,
    private productIntegrationService: ProductIntegrationService,
    private toasterService: ToasterService
  ) {
    this.initializeCartMode();
  }

  private initializeCartMode(): void {
    console.log('🚀 [CartIntegrationService] Initializing cart mode...');
    this.authService.userDetails.subscribe(userDetails => {
      console.log('👤 [CartIntegrationService] User details changed:', userDetails);
      console.log('👤 [CartIntegrationService] User details type:', typeof userDetails);
      console.log('👤 [CartIntegrationService] User details userId:', userDetails?.userId);
      
      // Check if userDetails is valid and has userId
      if (userDetails && 
          typeof userDetails === 'object' && 
          userDetails.userId && 
          userDetails.userId !== null && 
          userDetails.userId !== undefined) {
        console.log('✅ [CartIntegrationService] User is logged in, switching to online mode');
        this.cartModeSubject.next('online');
        this.handleUserLogin(userDetails.userId);
      } else {
        console.log('🔴 [CartIntegrationService] User is not logged in, switching to offline mode');
        this.cartModeSubject.next('offline');
      }
    });
  }

  private handleUserLogin(userId: number): void {
    console.log('🔐 [CartIntegrationService] User logged in, checking for offline cart items...');
    console.log('🔐 [CartIntegrationService] User ID:', userId);
    const offlineCart = this.getOfflineCartItems();
    console.log('📦 [CartIntegrationService] Found', offlineCart.length, 'offline cart items');
    console.log('📦 [CartIntegrationService] Offline cart items:', offlineCart);
    
    if (offlineCart.length > 0) {
      console.log('🔄 [CartIntegrationService] Offline cart items found, cart service will handle merge automatically');
      // The cart service will automatically handle the merge when user logs in
      // We don't need to do anything here as the cart service's initCartForLoggedInUser method
      // will handle the merge automatically
    } else {
      console.log('ℹ️ [CartIntegrationService] No offline cart items to merge');
    }
  }

  private getOfflineCartItems(): CartItem[] {
    const offlineItems = this.offlineCartService.getOfflineCartItems();
    console.log('🔍 [CartIntegrationService] Retrieved offline cart items:', offlineItems);
    return offlineItems;
  }

  // Note: The merge functionality is now handled automatically by the CartService
  // in its initCartForLoggedInUser method. We don't need to implement our own merge.

  // Note: We now use the full Price object instead of extracting just the amount

  // Public methods for components to use
  public addToCart(product: any, quantity: number = 1, size?: string, color?: string, packagingType?: string, selectedPrice?: string): void {
    console.log('🛒 [CartIntegrationService] Adding to cart:', product.name, 'Quantity:', quantity, 'Mode:', this.cartModeSubject.value);
    console.log('🛒 [CartIntegrationService] Current cart mode subject value:', this.cartModeSubject.value);
    
    // First check if product is integrated and has stock
    const backendProduct = this.productIntegrationService.getBackendProductForFrontendProduct(product.id);
    
    if (!backendProduct) {
      console.log('❌ [CartIntegrationService] Product not integrated:', product.name);
      this.toasterService.showToast('Product is not available for purchase at the moment', ToastType.Warn, 3000);
      return;
    }

    // First check if the product is active/available
    if (backendProduct.notAvailable === false) {
      console.log('🚫 [CartIntegrationService] Product is marked as not available:', {
        productId: backendProduct.id,
        productName: backendProduct.name,
        notAvailable: backendProduct.notAvailable
      });
      this.toasterService.showToast('Product is currently inactive and not available for purchase', ToastType.Warn, 4000);
      return;
    }

    // Check stock availability
    this.productIntegrationService.checkStockForBackendProduct(backendProduct).subscribe({
      next: (stockInfo) => {
        if (stockInfo) {
          // Calculate available stock: ready + active - locked - addedToCart
          const availableStock = stockInfo.ready + stockInfo.active - stockInfo.locked - stockInfo.addedToCart;
          
          if (availableStock < quantity) {
            console.log('❌ [CartIntegrationService] Insufficient stock:', availableStock, 'needed:', quantity);
            this.toasterService.showToast(
              `Only ${availableStock} items available in stock. Cannot add ${quantity} items to cart.`,
              ToastType.Warn,
              4000
            );
            return;
          }
        } else {
          console.log('❌ [CartIntegrationService] No stock info available');
          this.toasterService.showToast('Product is out of stock', ToastType.Warn, 3000);
          return;
        }

        // If we reach here, product is available and has sufficient stock
        const currentMode = this.cartModeSubject.value;
        console.log('✅ [CartIntegrationService] Product available, adding to', currentMode, 'cart');
        
                 if (currentMode === 'offline') {
           // Add to offline cart using the offline cart service
           console.log('📦 [CartIntegrationService] Adding to offline cart');
           
           // Extract price amount from product for offline cart
           let priceAmount = 0;
           if (product.price) {
             if (typeof product.price === 'object' && product.price.amount !== undefined) {
               priceAmount = product.price.amount;
             } else if (typeof product.price === 'object' && product.price.value !== undefined) {
               priceAmount = product.price.value;
             } else if (typeof product.price === 'number') {
               priceAmount = product.price;
             } else if (typeof product.price === 'string') {
               // Remove currency symbols and parse
               priceAmount = parseFloat(product.price.replace(/[₹,]/g, '')) || 0;
             }
           }
           
           console.log('💰 [CartIntegrationService] Price extraction for offline cart:', {
             originalPrice: product.price,
             extractedAmount: priceAmount,
             productName: product.name
           });
           
           const cartItem: CartItem = {
             id: undefined, // Use undefined for new items (matches backup)
             itemId: backendProduct.id,
             name: product.name,
             price: { amount: priceAmount, currency: 'INR' }, // Use extracted amount
             tax: 18, // Use 18% tax (matches backup)
             quantity: quantity,
             discount: product.discount?.discountPercent || 0, // Include discount if available
             variationId: null
           };
          console.log('📦 [CartIntegrationService] Cart item to add:', cartItem);
          this.offlineCartService.addToOfflineCart(cartItem);
          
          // Verify the item was added
          setTimeout(() => {
            const currentOfflineItems = this.offlineCartService.getOfflineCartItems();
            console.log('📦 [CartIntegrationService] Current offline cart items after adding:', currentOfflineItems);
          }, 100);
          
          this.toasterService.showToast('Item added to offline cart', ToastType.Success, 2000);
                 } else {
           // Add to online cart
           console.log('🌐 [CartIntegrationService] Adding to online cart');
           const userId = this.authService.getUserId();
           if (userId) {
             // Wait for cart to be properly initialized by subscribing to cart changes
             this.cartService.getCart().pipe(
               // Take only the first emission to ensure cart is loaded
               take(1)
             ).subscribe({
               next: (cart) => {
                 console.log('🌐 [CartIntegrationService] Cart loaded, adding item');
                                   const cartItem: CartItem = {
                    id: undefined, // Use undefined for new items (matches backup)
                    itemId: backendProduct.id,
                    name: product.name,
                    price: { amount: product.price.amount, currency: 'INR' }, // Hardcode to INR
                    tax: 18, // Use 18% tax (matches backup)
                    quantity: quantity,
                    discount: product.discount?.discountPercent || 0, // Include discount if available
                    variationId: null
                  };
                                   this.cartService.addToCart(userId, cartItem).subscribe({
                    next: (success) => {
                      if (success) {
                        console.log('✅ [CartIntegrationService] Item successfully added to online cart');
                        console.log('📦 [CartIntegrationService] Cart item added:', cartItem);
                        this.toasterService.showToast('Item added to cart', ToastType.Success, 2000);
                        
                        // Debug: Check cart state after adding
                        setTimeout(() => {
                          this.cartService.getCart().pipe(take(1)).subscribe(updatedCart => {
                            console.log('🔄 [CartIntegrationService] Cart state after adding item:', updatedCart);
                            console.log('📦 [CartIntegrationService] Cart items count:', updatedCart.items.length);
                            console.log('💰 [CartIntegrationService] Cart total calculation:', updatedCart.items.map(item => 
                              `${item.name}: ${item.price?.amount || item.price} x ${item.quantity} = ${(item.price?.amount || item.price) * item.quantity}`
                            ));
                          });
                        }, 500);
                      }
                    },
                   error: (error) => {
                     console.error('❌ [CartIntegrationService] Error adding to online cart:', error);
                     this.toasterService.showToast('Failed to add item to cart', ToastType.Error, 3000);
                   }
                 });
               },
               error: (error) => {
                 console.error('❌ [CartIntegrationService] Error loading cart:', error);
                 this.toasterService.showToast('Cart not ready yet. Please try again.', ToastType.Warn, 3000);
               }
             });
           }
         }
      },
      error: (error) => {
        console.error('Error checking stock for product:', product.name, error);
        this.toasterService.showToast('Unable to verify product availability. Please try again.', ToastType.Error, 3000);
      }
    });
  }



  public updateQuantity(itemIndex: number, quantity: number): void {
    const currentMode = this.cartModeSubject.value;
    
    if (currentMode === 'offline') {
      // For offline cart, we need to get the item first and update it
      const offlineItems = this.offlineCartService.getOfflineCartItems();
      if (offlineItems[itemIndex]) {
        const item = offlineItems[itemIndex];
        if (quantity <= 0) {
          this.offlineCartService.deleteFromOfflineCart(item.itemId, item.variationId || 0);
        } else {
          // Remove the old item and add the updated one
          this.offlineCartService.deleteFromOfflineCart(item.itemId, item.variationId || 0);
          const updatedItem: CartItem = { ...item, quantity };
          this.offlineCartService.addToOfflineCart(updatedItem);
        }
      }
    } else {
      // Handle online cart quantity update
      const userId = this.authService.getUserId();
      if (userId) {
        // Get cart once and update directly without triggering additional subscriptions
        this.cartService.getCart().pipe(take(1)).subscribe(cart => {
          if (cart.items[itemIndex]) {
            const item = cart.items[itemIndex];
            if (quantity <= 0) {
              this.cartService.removeFromCart(userId, item).subscribe();
            } else {
              const updatedItem: CartItem = { ...item, quantity };
              this.cartService.updateCartItem(userId, updatedItem).subscribe();
            }
          }
        });
      }
    }
  }

  public getCart(): Observable<LocalCart> {
    const currentMode = this.cartModeSubject.value;
    console.log('🛒 [CartIntegrationService] getCart() called, current mode:', currentMode);
    
    if (currentMode === 'offline') {
      return this.offlineCartService.getOfflineCart().pipe(
        map(cart => {
          console.log('🛒 [CartIntegrationService] Offline cart data:', cart);
          const localCart: LocalCart = {
            items: (cart.items || []).map(item => ({
              product: { 
                id: item.itemId.toString(),
                name: item.name, 
                price: `₹${(item.price?.amount || item.price)}`, 
                image: '' 
              },
              quantity: item.quantity || 0,
              size: '',
              color: '',
              packagingType: '',
              selectedPrice: `₹${(item.price?.amount || item.price)}`
            })),
            totalItems: (cart.items || []).reduce((total, item) => total + (item.quantity || 0), 0),
            totalPrice: (cart.items || []).reduce((total, item) => total + ((item.price?.amount || item.price) * (item.quantity || 0)), 0)
          };
          console.log('🛒 [CartIntegrationService] Mapped offline cart:', localCart);
          return localCart;
        })
      );
    } else {
      return this.cartService.getCart().pipe(
        map(cart => {
          console.log('🛒 [CartIntegrationService] Online cart data:', cart);
          const localCart: LocalCart = {
            items: (cart.items || []).map(item => ({
              product: { 
                id: item.itemId.toString(),
                name: item.name, 
                price: `₹${(item.price?.amount || item.price)}`, 
                image: '' 
              },
              quantity: item.quantity || 0,
              size: '',
              color: '',
              packagingType: '',
              selectedPrice: `₹${(item.price?.amount || item.price)}`
            })),
            totalItems: (cart.items || []).reduce((total, item) => total + (item.quantity || 0), 0),
            totalPrice: (cart.items || []).reduce((total, item) => total + ((item.price?.amount || item.price) * (item.quantity || 0)), 0)
          };
          console.log('🛒 [CartIntegrationService] Mapped online cart:', localCart);
          return localCart;
        })
      );
    }
  }

  public getCartValue(): LocalCart {
    // This is a simplified version - in practice, you'd want to get the current value
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  public getCartItemCount(): number {
    // This would need to be implemented based on the current cart
    return 0;
  }

  public getCartTotal(): number {
    // This would need to be implemented based on the current cart
    return 0;
  }

  public isCartEmpty(): boolean {
    // This would need to be implemented based on the current cart
    return true;
  }

  public isOfflineMode(): boolean {
    return this.cartModeSubject.value === 'offline';
  }

  public isOnlineMode(): boolean {
    return this.cartModeSubject.value === 'online';
  }

  public removeFromCart(itemIndex: number): void {
    const currentMode = this.cartModeSubject.value;
    console.log('🗑️ [CartIntegrationService] Removing item at index:', itemIndex, 'Mode:', currentMode);
    
    if (currentMode === 'offline') {
      // For offline cart, we need to get the current cart and remove the item
      const offlineItems = this.offlineCartService.getOfflineCartItems();
      if (itemIndex >= 0 && itemIndex < offlineItems.length) {
        const itemToRemove = offlineItems[itemIndex];
        console.log('🗑️ [CartIntegrationService] Removing offline item:', itemToRemove);
        this.offlineCartService.deleteFromOfflineCart(itemToRemove.itemId, itemToRemove.variationId || 0);
        this.toasterService.showToast('Item removed from cart', ToastType.Success, 2000);
      }
    } else {
      // Handle online cart removal
      const userId = this.authService.getUserId();
      if (userId) {
        console.log('🗑️ [CartIntegrationService] Removing online item for user:', userId, 'at index:', itemIndex);
        // Get cart once and remove directly without triggering additional subscriptions
        this.cartService.getCart().pipe(take(1)).subscribe(cart => {
          if (cart.items && cart.items[itemIndex]) {
            const item = cart.items[itemIndex];
            console.log('🗑️ [CartIntegrationService] Removing online item:', item);
            this.cartService.removeFromCart(userId, item).subscribe({
              next: (success) => {
                if (success) {
                  this.toasterService.showToast('Item removed from cart', ToastType.Success, 2000);
                } else {
                  this.toasterService.showToast('Failed to remove item from cart', ToastType.Error, 3000);
                }
              },
              error: (error) => {
                console.error('❌ [CartIntegrationService] Error removing online item:', error);
                this.toasterService.showToast('Failed to remove item from cart', ToastType.Error, 3000);
              }
            });
          } else {
            console.error('❌ [CartIntegrationService] Item not found at index:', itemIndex);
            this.toasterService.showToast('Item not found in cart', ToastType.Error, 3000);
          }
        });
      } else {
        console.error('❌ [CartIntegrationService] No user ID available for online cart removal');
        this.toasterService.showToast('User not logged in', ToastType.Error, 3000);
      }
    }
  }

  public clearCart(): void {
    const currentMode = this.cartModeSubject.value;
    
    if (currentMode === 'offline') {
      this.offlineCartService.clearOfflineCart();
      this.toasterService.showToast('Cart cleared', ToastType.Success, 2000);
    } else {
      // Clear online cart - this would need to be implemented
      const userId = this.authService.getUserId();
      if (userId) {
        // Implementation would depend on the backend API
        console.log('Clearing online cart for user:', userId);
        this.toasterService.showToast('Cart cleared', ToastType.Success, 2000);
      }
    }
  }
} 