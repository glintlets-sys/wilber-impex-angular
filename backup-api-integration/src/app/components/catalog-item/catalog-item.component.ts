import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Cart, CartItem, CartService } from 'src/app/services/cart.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { Category } from 'src/app/services/categoryToy';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import { ItemRatings } from "src/app/services/item-ratings";
import { RatingService } from "src/app/services/rating-service.service";
import { NotifyMeService } from 'src/app/services/notifyMeService/notify-me.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { Toy } from 'src/app/services/toy';


@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss']
})
export class CatalogItemComponent implements OnInit {
  @Input() item: Toy;
  @Input() isMoreLink: boolean;
  @Input() categoryId: number;
  @Input() ageCategory: string | null;
  @Input() category: Category;
  @Input() itemsFromSameCategory: any[];
  @Input() strip: string;
  @Input() previewedData: any[]
  itemId: any;
  quantity: number = 1;
  itemRatings: ItemRatings;
  cartItems: CartItem[];
  cart: Cart;
  ratings: any[];
  addedToCartFlag: boolean = undefined;
  customerId: any;
  stockCount: number = 0;
  notifyMe: boolean = false;
  isUserLoggedIn: string;

  constructor(private router: Router,
    private authService: AuthenticationService,
    private cartService: CartService, private catalog: CatalogService,
    private ratingService: RatingService,
    private notify_me_service: NotifyMeService,
    private toster_service: ToasterService
  ) { }

  ngOnInit(): void {
    this.customerId = this.authService.getUserId();

    this.authService.isUserLoggedIn.subscribe((val) => {
      this.isUserLoggedIn = val;
    })

    if (this.item !== undefined) {
      this.initialize()
    }

    this.catalog.selectedCategory$.subscribe(val => {
      if ((val !== null) && (this.categoryId == null)) {
        this.categoryId = val
      }
    })

    this.updateCart();

  }

  initialize() {
    this.catalog.getStockCount(this.item.id).subscribe(val => {
      this.stockCount = val;
      if (this.stockCount == 0) {
        if (this.customerId) {
          this.notify_me_service.hasCapturedNotification(this.item.id, this.customerId).subscribe(val => {
            this.notifyMe = val;
          })
        }
      }
    })

    this.catalog.fetchStockCount(this.item.id);

    this.ratingService.getItemRating(this.item.id).subscribe(val => {
      this.itemRatings = val;
    })
    this.ratingService.fetchItemRating(this.item.id);
  }

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.cart = val;
    });
  }

  fetchCommentsByToyId(toyId: number) {
    if (this.ratings) {
      this.ratingService.getCommentsByToyId(toyId).subscribe(
        (ratings) => {
          this.ratings = ratings;
        },
        (error) => {
          // Handle error if fetching comments fails
          this.ratings = [];
        }
      );
    }
    return this.ratings;
  }

  public isAddedToCart() {
    if (this.item == null) {
      return false;
    }
    return this.isItemAddedToCart();
  }

  isItemAddedToCart() {
    let cartItem = this.cart.items?.find((cartItem) => Number(cartItem.itemId) === Number(this.item.id));
    if (cartItem !== undefined) {
      this.quantity = cartItem.quantity;
      this.addedToCartFlag = true;
    }
    return this.addedToCartFlag;
  }

  openProduct() {
    this.router.navigate(['product', this.item.id]);
  }

  public isOutofStock() {
    return !(this.stockCount > 0);
  }

  calculateDiscountedPrice(amount: number, percentVal: number) {
    return Math.round(amount * ((100 - percentVal) / 100));
  }

  public hasDiscount(discount: any): boolean {
    if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
      return false;
    }
    return true;
  }

  hasUserLoggedIn() {
    return this.isUserLoggedIn === "true";
  }

  public navigateToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  public addToCart() {

   // if(!this.hasUserLoggedIn())
   // {
   //   this.navigateToLogin();
   //   return;
   // }

    if(this.item.variations!== null && this.item.variations.length>1) {
      this.openProduct();
      return;
    }
    // just delegate to add to cart service. 
    let addedFlag: boolean;
    this.cartService.addToCart(Number(this.authService.getUserId()), {
      "id": undefined,
      "itemId": this.item.id,
      "name": this.item.name,
      "quantity": Number(this.quantity),
      "tax": this.item.tax,
      "price": this.item.price,
      "discount": this.item.discount?.discountPercent,
      "variationId": this.item.variations!==null?(this.item.variations.length>0?this.item.variations[0].id:null):null
    }).subscribe((val) => {
      addedFlag = val;
      if (addedFlag) {
        this.addedToCartFlag = true;
      }
    });
  }

  increaseQuantity() {

    // TODO: 
    /**
     * We really need to have a logic as to how many is the max items a customer can buy. 
     *  1. one we need this number as part of the item data itself. -- TODO. 
     *  2. what if this is a return gift so these items can be more in number even in 100s too. So this number is always pulled from the item. 
     *  3. Another imp question is how many can i lock.. i think there is no specific logic for locking. 
     * but the time to keep an item locked for a user needs to be specified in the item too. This is also important. if the quantity is more the time to wait need not be more. As its blocking the other customer from buying. 
     * Like just wait for 2 mins or so to buy if the order is more than 50 items. 
     */

    if (this.quantity < 4) {
      this.quantity++;
    }

    if (this.addedToCartFlag) {
      this.cartService.addToCart(Number(this.authService.getUserId()), {
        "id": undefined,
        "itemId": this.item.id,
        "name": this.item.name,
        "quantity": Number(this.quantity),
        "tax": this.item.tax,
        "price": this.item.price.amount,
        "discount": this.item.discount?.discountPercent,
        "variationId":this.item.variations!==null?(this.item.variations.length>0?this.item.variations[0].id:null):null
      });
    }

  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }

    else if (this.quantity > 0) {
      this.quantity = 1;
      let cartItem = this.cart.items?.find((cartItem) => Number(cartItem.itemId) === Number(this.item.id));
      this.cartService.removeFromCart(Number(this.authService.getUserId()), cartItem);
      // TODO: show a toaster 
      this.addedToCartFlag = false;
    }

    if (this.addedToCartFlag) {
      this.cartService.addToCart(Number(this.authService.getUserId()), {
        "id": undefined,
        "itemId": this.item.id,
        "name": this.item.name,
        "quantity": Number(this.quantity),
        "price": this.item.price,
        "tax": this.item.tax,
        "discount": this.item.discount?.discountPercent,
        "variationId": this.item.variations!==null?(this.item.variations.length>0?this.item.variations[0].id:null):null
      });
    }
  }

  createNotifyMe(item) {
    this.notify_me_service.captureNotification(item.id, Number(this.authService.getUserId())).subscribe(val => {
      this.initialize()
      this.toster_service.showToast("We will notify you once the product is in stock", ToastType.Success, 2000);
    });
  }

}
