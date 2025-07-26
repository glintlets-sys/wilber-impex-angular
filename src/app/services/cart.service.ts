import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  packagingType?: string;
  selectedPrice?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('wilber-cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.clearCart();
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('wilber-cart', JSON.stringify(cart));
  }

  private updateCart(cart: Cart): void {
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  addToCart(product: Product, quantity: number = 1, size?: string, color?: string, packagingType?: string, selectedPrice?: string): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.items.findIndex(
      item => item.product.id === product.id && 
              item.size === size && 
              item.color === color &&
              item.packagingType === (packagingType || product.packagingType)
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      currentCart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const cartItem: CartItem = {
        product,
        quantity,
        size,
        color,
        packagingType: packagingType || product.packagingType,
        selectedPrice: selectedPrice || product.price
      };
      currentCart.items.push(cartItem);
    }

    this.calculateCartTotals(currentCart);
    this.updateCart(currentCart);
  }

  removeFromCart(itemIndex: number): void {
    const currentCart = this.cartSubject.value;
    currentCart.items.splice(itemIndex, 1);
    this.calculateCartTotals(currentCart);
    this.updateCart(currentCart);
  }

  updateQuantity(itemIndex: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemIndex);
      return;
    }

    const currentCart = this.cartSubject.value;
    currentCart.items[itemIndex].quantity = quantity;
    this.calculateCartTotals(currentCart);
    this.updateCart(currentCart);
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
    this.updateCart(emptyCart);
  }

  private calculateCartTotals(cart: Cart): void {
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => {
      const price = this.extractPrice(item.selectedPrice || item.product.price);
      return total + (price * item.quantity);
    }, 0);
  }

  private extractPrice(priceString: string): number {
    // Remove currency symbol and commas, then convert to number
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }

  getCart(): Observable<Cart> {
    return this.cart$;
  }

  getCartValue(): Cart {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    return this.cartSubject.value.totalItems;
  }

  getCartTotal(): number {
    return this.cartSubject.value.totalPrice;
  }

  isCartEmpty(): boolean {
    return this.cartSubject.value.items.length === 0;
  }

  // Get cart items for merging with backend
  getCartItems(): CartItem[] {
    return this.cartSubject.value.items;
  }

  // Merge cart with backend data (called after login)
  mergeWithBackendCart(backendItems: CartItem[]): void {
    const currentCart = this.cartSubject.value;
    
    // Merge items from backend with local cart
    backendItems.forEach(backendItem => {
      const existingItemIndex = currentCart.items.findIndex(
        item => item.product.id === backendItem.product.id && 
                item.size === backendItem.size && 
                item.color === backendItem.color &&
                item.packagingType === backendItem.packagingType
      );

      if (existingItemIndex >= 0) {
        // Add quantities if same item exists
        currentCart.items[existingItemIndex].quantity += backendItem.quantity;
      } else {
        // Add new item from backend
        currentCart.items.push(backendItem);
      }
    });

    this.calculateCartTotals(currentCart);
    this.updateCart(currentCart);
  }
} 