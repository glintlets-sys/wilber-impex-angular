import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, Subscription, forkJoin } from 'rxjs';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
import { OfflineCartService } from './offline-cart.service';
import { Variation } from '@popperjs/core';

const SERVICE_URL = environment.serviceURL;
@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {


  private cartApiUrl = SERVICE_URL + 'cart/users';
  private cartSubject = new BehaviorSubject<Cart>({ id: undefined, userId: 0, items: [] });
  private cart: Cart;
  user: any ;
  //private storageKey = "cart";

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
    private toaster: ToasterService,
    private offlineCartService: OfflineCartService,
    
  ) {
    this.initCartForLoggedInUser();
  }

  offlineSubs: Subscription | undefined;
  private userDetailsSubscription: Subscription | undefined;
  
  private loadOfflineCart() {
    this.offlineCartService.getOfflineCart().subscribe(cart => {
      //this.cartSubject.next(cart);
      if(cart !== undefined && cart.items !== undefined){
        this.cartSubjectNext(cart);
      }
      
    });
  }

  cartSubjectNext(val: Cart) {
    this.cartSubject.next(val);
  }

  private addOfflineItemsToOnlineCart(userId: number, offlineItems: CartItem[], onlineCart: Cart): Observable<Cart> {
    const updateObservables = offlineItems.map(item => {
      const existingItem = onlineCart.items?.find(cartItem => cartItem.itemId === item.itemId);
      if (existingItem) {
        existingItem.quantity = existingItem.quantity ? existingItem.quantity + (item.quantity ?? 0) : item.quantity;
        return this.updateCartItem(userId, existingItem);
      } else {
        return this.createCartItem(userId, item);
      }
    });

    return forkJoin(updateObservables).pipe(
      map(() => {
        this.offlineCartService.clearOfflineCart();
        return onlineCart;
      })
    );
  }

  public initCartForLoggedInUser() {
    // Unsubscribe from previous subscription to prevent duplicates
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
    
    this.userDetailsSubscription = this.authService.userDetails.subscribe((val) => {
      // console.log("Subscription called: " + JSON.stringify(val));
      let id = val.userId;//JSON.parse(val).userId;
      this.user = val;
      if (!id) {
        this.loadOfflineCart();
        this.offlineSubs?.unsubscribe();
        return; // Exit if the ID is not valid
      } 
      // console.log("API getting called for user ID:", id);
      timer(500) // Starts a timer that emits after 500ms
        .pipe(
          switchMap(() => this.http.get<Cart>(`${this.cartApiUrl}/${id}`)),
          take(1), // Ensure only one API call per user change
          tap((cart: Cart) => {
            this.cart = cart;
            // console.log("Cart received from backend:" + JSON.stringify(cart));
          })
        ).subscribe({
          next: (cart) => {
            this.cartSubject.next(cart)
            const offlineItems = this.offlineCartService.getOfflineCartItems();
            this.addOfflineItemsToOnlineCart(id,offlineItems, cart).subscribe();
          
          },
          error: (err) => console.error("Failed to load cart:", err)
        });
    }, error => console.error("Failed to get user details:", error));
  }

  refreshCart()
  {
    console.log('🔄 [CartService] refreshCart() - Starting cart refresh');
    
    if (!this.user || !this.user.userId) {
      console.error("❌ [CartService] refreshCart() - Cannot refresh cart: user not available:", {
        userExists: !!this.user,
        userId: this.user?.userId
      });
      return;
    }
    
    console.log('👤 [CartService] refreshCart() - User validated, making API call for userId:', this.user.userId);
    
    timer(500) // Starts a timer that emits after 500ms
    .pipe(
      switchMap(() => {
        const apiUrl = `${this.cartApiUrl}/${this.user.userId}`;
        console.log('🌐 [CartService] refreshCart() - Making HTTP GET request to:', apiUrl);
        return this.http.get<Cart>(apiUrl);
      }),
      take(1), // Ensure only one API call
      tap((cart: Cart) => {
        console.log('📦 [CartService] refreshCart() - Received cart from backend:', {
          cartId: cart?.id,
          itemCount: cart?.items?.length || 0,
          items: cart?.items?.map(item => ({
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity
          })) || []
        });
        this.cart = cart;
      })
    ).subscribe({
      next: (cart) => {
        console.log('✅ [CartService] refreshCart() - Broadcasting updated cart to subscribers');
        this.cartSubject.next(cart);
      },
      error: (err) => {
        console.error("❌ [CartService] refreshCart() - Failed to load cart:", err);
      }
    });
  }

  isItemInCartFromItemId(cartItemId: Number): Observable<boolean> {
    return this.isItemInCart({
      id: null,
      itemId: Number(cartItemId),
      name: null,
      price: null,
      tax: null,
      quantity: null,
      discount: null,
      variationId: null
    })
  }

  isItemInCart(item: CartItem): Observable<boolean> {
    // Get the current cart
    const cart$ = this.getCart();

    // Check if the item is in the cart
    const itemInCart$ = cart$.pipe(
      map((cart: Cart) => {
        // Check if any of the items in the cart have the same ID as the provided item
        return cart.items.some((cartItem) => (Number(cartItem.itemId) === Number(item?.itemId)));
      })
    );

    // Return an observable of the result
    return itemInCart$;
  }
  initCart(userId: number): void {
    this.http.get<Cart>(`${this.cartApiUrl}/${userId}`)
      .pipe(
        tap((cart: Cart) => {
          this.cart = cart;
          this.cartSubject.next(cart);
          //     this.saveCartToStorage();
        })
      )
      .subscribe();
  }

  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addToCart(userId: number, item: CartItem): Observable<boolean> {

    console.log("user id : " + userId);
    if (!(userId)) {
      this.offlineCartService.addToOfflineCart(item);
      this.loadOfflineCart(); // Notify UI about the offline cart changes
      return of(true);
    }

    let existingItem = undefined;

    if (this.cart != undefined) {
      existingItem = this.getCartItem(item);
    }

    if (existingItem) {
      existingItem.quantity = item.quantity;
      return this.updateCartItem(userId, existingItem);
    } else {
      return this.createCartItem(userId, item);
    }
  }

  createCartItem(userId: number, item: CartItem): Observable<boolean> {

    return this.http.post<Cart>(`${this.cartApiUrl}/${userId}`, item)
      .pipe(
        catchError((error) => {
          // Handle the error response here
          this.toaster.showToast(JSON.stringify("Due to high demand, the item is out of stock. Sorry for your trouble."), ToastType.Error, 3000);
          // You can perform additional error handling or throw a custom error if needed
          return throwError('Error creating cart item');
        }),
        tap((cart: Cart) => {
          if (cart) {
            this.cart = cart;
            this.cartSubject.next(cart);
            //   this.saveCartToStorage();
          }
        }),
        map((cart: Cart) => !!cart)
      );
  }

  updateCartItem(userId: number, item: CartItem): Observable<boolean> {
    return this.http.put<Cart>(`${this.cartApiUrl}/${userId}/${item.itemId}`, item)
      .pipe(
        catchError((error) => {
          // Handle the error response here
          this.toaster.showToast(JSON.stringify("Due to high demand, the item is out of stock. Sorry for your trouble."), ToastType.Error, 3000);
          // You can perform additional error handling or throw a custom error if needed
          return throwError('Error creating cart item');
        }),
        tap((cart: Cart) => {
          if (cart) {
            this.cart = cart;
            this.cartSubject.next(this.cart);
            //   this.saveCartToStorage();
          }
        }),
        map((cart: Cart) => !!cart)
      );
  }

  removeFromCart(userId: number, cartItem: CartItem): Observable<boolean> {

    console.log("user id : " + userId);
    if (!(userId)) {
      this.offlineCartService.deleteFromOfflineCart(cartItem.itemId, cartItem.variationId);
      //this.loadOfflineCart(); // Notify UI about the offline cart changes
      return of(true);
    }
   return this.deleteCartItem(userId, cartItem);
  }



  deleteCartItem(userId: number, cartItem: CartItem): Observable<boolean> {

    console.log("user id : " + userId);
    if (!(userId)) {
      this.offlineCartService.deleteFromOfflineCart(cartItem.itemId, cartItem.variationId);
      //this.loadOfflineCart(); // Notify UI about the offline cart changes
      return of(true);
    }

    if(cartItem.variationId!== null) {
      return this.http.delete<Cart>(`${this.cartApiUrl}/${userId}/${cartItem.itemId}/${cartItem.variationId}`).pipe(
        tap((cart: Cart) => {
          if (cart) {
            this.cart = cart;
            this.cartSubject.next(cart);
            // this.saveCartToStorage();
          }
        }),
        map((cart: Cart) => !!cart)
      );
    }

    return this.http.delete<Cart>(`${this.cartApiUrl}/${userId}/${cartItem.itemId}`)
      .pipe(
        tap((cart: Cart) => {
          if (cart) {
            this.cart = cart;
            this.cartSubject.next(cart);
            // this.saveCartToStorage();
          }
        }),
        map((cart: Cart) => !!cart)
      );
  }

  getCartItem(item: CartItem): CartItem {

    const itemFound = this.cartSubject.getValue()?.items.find(
      (cartItem) =>
        Number(cartItem?.itemId) === Number(item?.itemId) &&
        (cartItem?.variationId === item?.variationId)
    );
    return itemFound;
  }

  // private saveCartToStorage(): void {
  //   localStorage.setItem('cart', JSON.stringify(this.cart));
  // }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    if (this.userDetailsSubscription) {
      this.userDetailsSubscription.unsubscribe();
    }
    if (this.offlineSubs) {
      this.offlineSubs.unsubscribe();
    }
  }
}

export interface CartItem {
  id: number;
  itemId: number;
  name: string;
  price: any;
  tax: number;
  quantity: number;
  discount: number;
  variationId?: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}
