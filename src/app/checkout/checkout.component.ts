import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartIntegrationService, LocalCartItem } from '../services/cart-integration.service';
import { CartService } from '../shared-services/cart.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { User } from '../shared-services/user';
import { AddressService, Address } from '../shared-services/address.service';
import { CatalogService } from '../shared-services/catalog.service';
import { Toy } from '../shared-services/toy';
import { Subscription } from 'rxjs';
import { take } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';
import { PaymentService } from '../shared-services/payment.service';
import { PhonePePaymentService } from '../shared-services/phone-pe-payment.service';
import { LoadingOverlayService } from '../shared-services/loading-overlay.service';
import { ToasterService } from '../shared-services/toaster.service';
import { ToastType } from '../shared-services/toaster';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: LocalCartItem[] = [];
  totalItems = 0;
  totalPrice = 0;
  currentUser: User | null = null;
  addresses: Address[] = [];
  selectedAddress: Address | null = null;

  private catalogItems: Toy[] = [];
  private fetchRequests = new Map<number, boolean>();
  private isCatalogLoading: boolean = false;
  private cartSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private cartIntegrationService: CartIntegrationService,
    private cartService: CartService,
    private authService: AuthenticationService,
    private addressService: AddressService,
    private catalogService: CatalogService,
    private router: Router,
    private paymentService: PaymentService,
    private phonepePaymentService: PhonePePaymentService,
    private loadingService: LoadingOverlayService,
    private toasterService: ToasterService
  ) {
    this.cartSubscription = this.cartIntegrationService.getCart().subscribe(cart => {
      console.log('🛒 [CheckoutComponent] Cart updated:', cart);
      console.log('📦 [CheckoutComponent] Cart items details:', cart.items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        selectedPrice: item.selectedPrice,
        quantity: item.quantity,
        itemTotal: this.getItemTotal(item),
        productId: item.product.id
      })));
      this.cartItems = cart.items;
      this.totalItems = cart.totalItems;
      this.totalPrice = cart.totalPrice;
      console.log('📦 [CheckoutComponent] Cart items count:', this.cartItems.length);
      console.log('💰 [CheckoutComponent] Total price:', this.totalPrice);
      
      // Load catalog data when cart is updated (like in backup)
      if (this.catalogItems.length === 0 && !this.isCatalogLoading) {
        this.isCatalogLoading = true;
        this.catalogService.getCatalogList().subscribe(catalogItems => {
          this.isCatalogLoading = false;
          this.catalogItems = catalogItems;
          console.log('📦 [CheckoutComponent] Loaded catalog items:', catalogItems.length);
        });
      }
    });
    
    this.userSubscription = this.authService.userDetails.subscribe(userDetails => {
      if (userDetails && userDetails !== '') {
        this.currentUser = userDetails;
      }
    });
  }

  ngOnInit(): void {
    console.log('🛒 [CheckoutComponent] Initializing checkout...');
    
    // Check if user is logged in
    this.authService.isUserLoggedIn.subscribe(isLoggedIn => {
      console.log('👤 [CheckoutComponent] User login status:', isLoggedIn);
      if (isLoggedIn !== 'true') {
        console.log('🔴 [CheckoutComponent] User not logged in, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }
    });

    // Load addresses
    this.loadAddresses();
    
    // Debug cart state
    console.log('📦 [CheckoutComponent] Current cart items:', this.cartItems);
    console.log('💰 [CheckoutComponent] Current total price:', this.totalPrice);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadAddresses(): void {
    this.addressService.getAllAddresses().subscribe(addresses => {
      this.addresses = addresses;
      // Set default address if available
      const defaultAddress = addresses.find(addr => addr.isDefault);
      this.selectedAddress = defaultAddress || (addresses.length > 0 ? addresses[0] : null);
    });
  }



  selectAddress(address: Address): void {
    this.selectedAddress = address;
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  updateQuantity(itemIndex: number, quantity: number): void {
    if (quantity > 0) {
      // Use cart service directly like backup implementation
      const userId = this.authService.getUserId();
      if (userId && this.cartItems[itemIndex]) {
        const item = this.cartItems[itemIndex];
        // Create cart item in the format expected by the backend
        const cartItem = {
          id: undefined,
          itemId: parseInt(item.product.id),
          name: item.product.name,
          price: { amount: this.extractPrice(item.product.price), currency: 'INR' },
          tax: 18,
          quantity: quantity,
          discount: 0,
          variationId: null
        };
        
        this.cartService.addToCart(userId, cartItem).subscribe({
          next: (success) => {
            if (success) {
              console.log('✅ [CheckoutComponent] Quantity updated successfully');
            } else {
              console.log('❌ [CheckoutComponent] Failed to update quantity');
            }
          },
          error: (error) => {
            console.error('❌ [CheckoutComponent] Error updating quantity:', error);
          }
        });
      }
    }
  }

  removeItem(itemIndex: number): void {
    const userId = this.authService.getUserId();
    if (userId && this.cartItems[itemIndex]) {
      const item = this.cartItems[itemIndex];
      const cartItem = {
        id: undefined,
        itemId: parseInt(item.product.id),
        name: item.product.name,
        price: { amount: this.extractPrice(item.product.price), currency: 'INR' },
        tax: 18,
        quantity: item.quantity,
        discount: 0,
        variationId: null
      };
      
      this.cartService.deleteCartItem(userId, cartItem).subscribe({
        next: (success) => {
          if (success) {
            console.log('✅ [CheckoutComponent] Item removed successfully');
          } else {
            console.log('❌ [CheckoutComponent] Failed to remove item');
          }
        },
        error: (error) => {
          console.error('❌ [CheckoutComponent] Error removing item:', error);
        }
      });
    }
  }

  clearCart(): void {
    this.cartIntegrationService.clearCart();
  }

  getItemTotal(item: LocalCartItem): number {
    const price = this.extractPrice(item.selectedPrice || item.product.price);
    return price * item.quantity;
  }

  extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }

  fetchImageForItem(itemId: string | number): string | undefined {
    // Convert itemId to number if it's a string
    const numericItemId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    
    // If catalogItems is not loaded yet, return undefined to prevent infinite calls
    if (!this.catalogItems || this.catalogItems.length === 0) {
      return undefined;
    }
    
    const item = this.catalogItems.find((toy) => toy.id === numericItemId);

    // If the item exists, return the photo link if available.
    if (item) {
      return item.photoLinks ? item.photoLinks[0] : null;
    }

    // If there is already a request for this item in progress, do nothing.
    if (this.fetchRequests.has(numericItemId)) {
      return undefined;
    }

    // Only make individual API calls if we have a valid numericItemId
    if (numericItemId && !isNaN(numericItemId)) {
      // Mark that a request for this item is in progress.
      this.fetchRequests.set(numericItemId, true);

      // Fetch the item from the catalog service and update the catalogItems list.
      this.catalogService.getCatalogItem(numericItemId).subscribe({
        next: (val) => {
          this.catalogItems.push(val);
          // Remove the itemId from the fetchRequests map once the item is retrieved.
          this.fetchRequests.delete(numericItemId);
        },
        error: (err) => {
          console.error('Failed to fetch catalog item:', err);
          // Remove the itemId from the fetchRequests map on error.
          this.fetchRequests.delete(numericItemId);
        }
      });
    }

    return undefined;
  }

  proceedToPayment(): void {
    console.log('🚀 [CheckoutComponent] proceedToPayment() - Starting payment process');
    
    if (!this.currentUser) {
      console.log('❌ [CheckoutComponent] proceedToPayment() - No user logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('👤 [CheckoutComponent] proceedToPayment() - User validated:', {
      userId: this.currentUser.id,
      username: this.currentUser.name
    });
    
    if (!this.selectedAddress) {
      console.log('❌ [CheckoutComponent] proceedToPayment() - No address selected');
      this.toasterService.showToast('Please select a delivery address', ToastType.Warn, 3000);
      return;
    }
    
    console.log('📍 [CheckoutComponent] proceedToPayment() - Address validated:', {
      addressId: this.selectedAddress.id,
      city: this.selectedAddress.city,
      pincode: this.selectedAddress.pincode
    });
    
    // Set the selected address in payment service
    this.paymentService.setSelectedAddress(this.selectedAddress);
    console.log('✅ [CheckoutComponent] proceedToPayment() - Address set in payment service');
    
    // Process payment using PhonePe
    console.log('🔄 [CheckoutComponent] proceedToPayment() - Calling processPaymentWithPhonePe()');
    this.processPaymentWithPhonePe();
  }

  processPaymentWithPhonePe(): void {
    console.log('💳 [CheckoutComponent] processPaymentWithPhonePe() - Starting PhonePe payment process');
    
    localStorage.removeItem("couponCode");
    console.log('🧹 [CheckoutComponent] processPaymentWithPhonePe() - Removed couponCode from localStorage');
    
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
    console.log('⏳ [CheckoutComponent] processPaymentWithPhonePe() - Showing loading overlay');
  
    // Fetch the current cart and take only the first emission
    console.log('🛒 [CheckoutComponent] processPaymentWithPhonePe() - Fetching current cart with take(1)');
    this.cartService.getCart().pipe(
      take(1) // Take only the first emission
    ).subscribe({
      next: (cartOld) => {
        console.log('📦 [CheckoutComponent] processPaymentWithPhonePe() - Received old cart:', {
          cartId: cartOld?.id,
          itemCount: cartOld?.items?.length || 0,
          items: cartOld?.items?.map(item => ({
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })) || []
        });
        
        // Copy the old cart
        const oldCart = JSON.parse(JSON.stringify(cartOld));
        console.log('📋 [CheckoutComponent] processPaymentWithPhonePe() - Created deep copy of old cart');
  
        // Refresh the cart
        console.log('🔄 [CheckoutComponent] processPaymentWithPhonePe() - Calling cartService.refreshCart()');
        this.cartService.refreshCart();
  
        // Wait a moment for refresh to complete, then fetch new cart
        setTimeout(() => {
          console.log('⏱️ [CheckoutComponent] processPaymentWithPhonePe() - Waiting 1 second for cart refresh, now fetching new cart');
          
          // Fetch a new cart and take only the first emission
          this.cartService.getCart().pipe(
            take(1) // Take only the first emission
          ).subscribe({
            next: (cartNew) => {
              console.log('📦 [CheckoutComponent] processPaymentWithPhonePe() - Received new cart:', {
                cartId: cartNew?.id,
                itemCount: cartNew?.items?.length || 0,
                items: cartNew?.items?.map(item => ({
                  itemId: item.itemId,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price
                })) || []
              });
              
              // Compare the old cart to the new cart
              const oldCartString = JSON.stringify(oldCart);
              const newCartString = JSON.stringify(cartNew);
              const cartsMatch = oldCartString === newCartString;
              
              console.log('🔍 [CheckoutComponent] processPaymentWithPhonePe() - Cart comparison result:', {
                cartsMatch: cartsMatch,
                oldCartItemsLength: oldCart?.items?.length || 0,
                newCartItemsLength: cartNew?.items?.length || 0
              });
              
              if (!cartsMatch) {
                console.log('❌ [CheckoutComponent] processPaymentWithPhonePe() - Cart mismatch detected, stock may have changed');
                this.loadingService.hideLoadingOverlay();
                this.toasterService.showToast("Some of the cart items are out of stock. Please review and proceed for payment", ToastType.Error, 3000);
              } else {
                console.log('✅ [CheckoutComponent] processPaymentWithPhonePe() - Carts match, proceeding with payment');
                
                // Proceed to store the purchase summary and generate the order ID for payment redirect
                console.log('📝 [CheckoutComponent] processPaymentWithPhonePe() - Calling paymentService.initiatePayment()');
                this.paymentService.initiatePayment().subscribe({
                  next: (response) => {
                    // Handle the response here
                    const orderId = response;
                    console.log('🎯 [CheckoutComponent] processPaymentWithPhonePe() - Order created successfully:', {
                      orderId: orderId,
                      orderIdType: typeof orderId
                    });
                    
                    localStorage.setItem("completedOrderId", orderId);
                    console.log('💾 [CheckoutComponent] processPaymentWithPhonePe() - Stored orderId in localStorage');
                    
                    // Now that the order details are stored, initiate the payment
                    console.log('🚀 [CheckoutComponent] processPaymentWithPhonePe() - Calling PhonePe makePaymentThroughBackend()');
                    this.toasterService.showToast("Redirecting to Payment gateway", ToastType.Info, 5000);
                    this.phonepePaymentService.makePaymentThroughBackend(orderId);
                    console.log('✅ [CheckoutComponent] processPaymentWithPhonePe() - PhonePe payment initiated');
                  },
                  error: (error) => {
                    // Handle any errors that occur during the request
                    console.error('❌ [CheckoutComponent] processPaymentWithPhonePe() - Error creating order:', error);
                    this.toasterService.showToast("Something went Wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", ToastType.Error, 3000);
                  },
                  complete: () => {
                    console.log('🏁 [CheckoutComponent] processPaymentWithPhonePe() - Payment initiation completed');
                    this.loadingService.hideLoadingOverlay();
                  }
                });
              }
            },
            error: (error) => {
              console.error('❌ [CheckoutComponent] processPaymentWithPhonePe() - Error fetching new cart:', error);
              this.loadingService.hideLoadingOverlay();
              this.toasterService.showToast("Something went wrong while fetching the new cart. Please try again.", ToastType.Error, 3000);
            }
          });
        }, 1000); // Wait 1 second for cart refresh
      },
      error: (error) => {
        console.error('❌ [CheckoutComponent] processPaymentWithPhonePe() - Error fetching old cart:', error);
        this.loadingService.hideLoadingOverlay();
        this.toasterService.showToast("Something went wrong while processing your cart. Please try again.", ToastType.Error, 3000);
      }
    });
  }
} 