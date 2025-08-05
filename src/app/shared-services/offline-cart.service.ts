import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from './cart.service';

const LOCAL_STORAGE_CART_KEY = 'offlineCart';

@Injectable({
  providedIn: 'root'
})
export class OfflineCartService {

  private offlineCartSubject = new BehaviorSubject<Cart>({ id: undefined, userId: 0, items: [] });

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    console.log('🛒 [OfflineCartService] Loading cart from localStorage:', savedCart);
    if (savedCart) {
      this.offlineCartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCartToLocalStorage(cart: Cart): void {
    console.log('🛒 [OfflineCartService] Saving cart to localStorage:', cart);
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }

  public getOfflineCart(): Observable<Cart> {
    return this.offlineCartSubject.asObservable();
  }

  public addToOfflineCart(item: CartItem): void {
    console.log('🛒 [OfflineCartService] Adding item to offline cart:', item);
    const currentCart = this.offlineCartSubject.value;
    console.log('🛒 [OfflineCartService] Current cart before adding:', currentCart);
    
    let existingItem = currentCart.items?.find(cartItem => (cartItem.itemId === item.itemId)&&(cartItem.variationId === item.variationId));

    if (existingItem) {
      console.log('🛒 [OfflineCartService] Updating existing item quantity');
      existingItem.quantity = item.quantity;
    } else {
      console.log('🛒 [OfflineCartService] Adding new item to cart');
      currentCart.items?.push(item);
    }

    console.log('🛒 [OfflineCartService] Cart after adding item:', currentCart);
    this.offlineCartSubject.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
    console.log('🛒 [OfflineCartService] Cart saved to localStorage');
  }

  public deleteFromOfflineCart(itemId: number, variationId: number): void {
    const currentCart = this.offlineCartSubject.value;
    currentCart.items = currentCart.items?.filter(item => item.itemId !== itemId || item.variationId !== variationId);
    this.offlineCartSubject.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
  }

  public clearOfflineCart(): void {
    this.offlineCartSubject.next({ id: undefined, userId: 0, items: [] });
    localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
  }

  public getOfflineCartItems(): CartItem[] {
    const items = this.offlineCartSubject.value.items || [];
    console.log('🛒 [OfflineCartService] Getting offline cart items:', items);
    return items;
  }
}
