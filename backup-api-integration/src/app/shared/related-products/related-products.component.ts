import { Component, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { Toy } from 'src/app/services/toy';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrls: ['./related-products.component.scss']
})
export class RelatedProductsComponent {

  @Input() item: any
  itemRatings: any;
  itemId: any;
  cartItems: CartItem[];
  quantity: number = 1;
  public addedToCartFlag: boolean = undefined;

  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
  ) {
  }

  openProduct() {
    throw new Error('Method not implemented.');
  }

  public hasDiscount(discount: any): boolean {
    if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
      return false;
    }
    return true;
  }

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.cartItems = val.items;
    });
  }

  public isAddedToCart() {
    if (this.item == null) {
      return false;
    }
    return this.isItemAddedToCart();
  }

  isItemAddedToCart() {
    let cartItem = this.cartItems?.find((cartItem) => Number(cartItem.itemId) === Number(this.item.id));
    if (cartItem !== undefined) {
      this.quantity = cartItem.quantity;
      this.addedToCartFlag = true;
    }
    return this.addedToCartFlag;
  }

  increaseQuantity() {
    if (this.quantity < 4) {
      this.quantity++;
    }
    if (this.addedToCartFlag) {
      this.cartService.addToCart(Number(this.authService.getUserId()), {
        "id": undefined,
        "itemId": this.item.id,
        "name": this.item.name,
        "quantity": Number(this.quantity),
        "tax": 18,
        "price": this.item.price.amount,
        "discount": this.item.discount?.discountPercent
      });
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
    else if (this.quantity > 0) {
      this.quantity = 1;
      let cartItem = this.cartItems?.find((cartItem) => Number(cartItem.itemId) === Number(this.item.id));
      this.cartService.removeFromCart(Number(this.authService.getUserId()), cartItem);
      this.addedToCartFlag = false;
    }
    if (this.addedToCartFlag) {
      this.cartService.addToCart(Number(this.authService.getUserId()), {
        "id": undefined,
        "itemId": this.item.id,
        "name": this.item.name,
        "quantity": Number(this.quantity),
        "price": this.item.price,
        "tax": 18,
        "discount": this.item.discount?.discountPercent
      });
    }
  }

  calculateDiscountedPrice(amount: number, percentVal: number) {
    return amount * ((100 - percentVal) / 100);
  }

  public addToCart() {
    // just delegate to add to cart service. 
    let addedFlag: boolean;
    this.cartService.addToCart(Number(this.authService.getUserId()), {
      "id": undefined,
      "itemId": this.item.id,
      "name": this.item.name,
      "quantity": Number(this.quantity),
      "tax": 18,
      "price": this.item.price,
      "discount": this.item.discount?.discountPercent
    }).subscribe((val) => {
      addedFlag = val;
      if (addedFlag) {
        this.addedToCartFlag = true;
      }
    });
  }
  public stockCount: number = 0;
  public isOutofStock() {
    return !(this.stockCount > 0);
  }
}
