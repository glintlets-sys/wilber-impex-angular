import { Component, Input, OnInit } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { Observable } from 'rxjs';
import { CategoryToy } from 'src/app/services/categoryToy';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ActivatedRoute } from '@angular/router';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import { Toy } from 'src/app/services/toy';
import { ItemRecommendationService } from 'src/app/services/item-recommendation.service';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-similar-products',
  templateUrl: './similar-products.component.html',
  styleUrls: ['./similar-products.component.scss']
})
export class SimilarProductsComponent implements OnInit {

  allItems: any[]; // Replace with the actual array of items
  visibleItems: any[];
  isLoading: boolean;
  @Input() item: any;
  itemRatings: any;
  quantity: number = 1;
  public addedToCartFlag: boolean = undefined;
  public items: any[];
  @Input() similar_item: any
  private loadingComplete: boolean = false;
  cartItems: CartItem[];
  itemId: any;

  constructor(private catalogService: CatalogService, private toasterService: ToasterService,
    private loadingOverlay: LoadingOverlayService,
    private route: ActivatedRoute,
    private recommendationService: RecommendationsTsService,
    private recommend_service: ItemRecommendationService,
    private cartService: CartService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    // this.isLoading = true;
    // this.recommendationService.recommendations$.subscribe((toys: Toy[])=>{
    //   this.allItems = toys.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
    //   const itemIdToRemove = this.item.id; // The ID of the item you want to remove
    //   this.allItems = this.allItems.filter(item => item.id !== itemIdToRemove);
    //   this.loadItems(0,10);
    //   this.isLoading = false;
    // })
    // window.addEventListener('scroll', this.onScroll.bind(this));
  }

  openProduct() {
    throw new Error('Method not implemented.');
  }

  // isPresentItem(itemFromLoop: Toy) {
  //   if (itemFromLoop.id === this.item.id) {
  //     return false;
  //   }
  //   return true;
  // }

  // getCatalogItems() {
  //   return this.items;
  // }

  // loadItems(startIndex: number, count: number) {
  //   if (this.visibleItems !== undefined && this.visibleItems.length !== 0) {
  //     const indexToRemove = this.allItems.findIndex(item => item.id === this.item.id);
  //     if (indexToRemove !== -1) {
  //       this.allItems.splice(indexToRemove, 1);
  //     }
  //     const newItems = this.allItems.filter(item => !this.visibleItems.some(vItem => vItem.id === item.id)).slice(startIndex, startIndex + count);
  //     if (newItems.length === 0) {
  //       this.loadingComplete = true;
  //     }
  //     this.visibleItems = [...this.visibleItems, ...newItems];
  //   } else {
  //     this.visibleItems = this.allItems.slice(startIndex, startIndex + count);
  //   }
  // }

  // onScroll() {
  //   if (
  //     window.innerHeight + window.scrollY >= document.body.offsetHeight &&
  //     !this.isLoading && !this.loadingComplete
  //   ) {
  //     this.isLoading = true;
  //     setTimeout(() => {
  //       const startIndex = this.visibleItems.length;
  //       this.loadItems(startIndex, 10);
  //       this.isLoading = false;
  //     }, 4000);
  //   }
  // }

  public hasDiscount(discount: any): boolean {
    if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
      return false;
    }
    return true;
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

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.cartItems = val.items;
    });
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
