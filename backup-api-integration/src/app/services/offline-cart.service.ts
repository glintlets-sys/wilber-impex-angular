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
    if (savedCart) {
      this.offlineCartSubject.next(JSON.parse(savedCart));
    }
  }

  private saveCartToLocalStorage(cart: Cart): void {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
  }

  public getOfflineCart(): Observable<Cart> {
    return this.offlineCartSubject.asObservable();
  }

  public addToOfflineCart(item: CartItem): void {
    const currentCart = this.offlineCartSubject.value;
    let existingItem = currentCart.items?.find(cartItem => (cartItem.itemId === item.itemId)&&(cartItem.variationId === item.variationId));

    if (existingItem) {
      existingItem.quantity = item.quantity;
    } else {
      currentCart.items?.push(item);
    }

    this.offlineCartSubject.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
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
    return this.offlineCartSubject.value.items || [];
  }
}
