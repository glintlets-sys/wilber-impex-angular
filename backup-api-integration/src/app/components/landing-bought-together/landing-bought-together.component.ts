import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BoughtTogetherService } from 'src/app/services/boughtTogetherService/bought-together.service';
import { CartService } from 'src/app/services/cart.service';
import { ItemRatings } from 'src/app/services/item-ratings';
import { RatingService } from 'src/app/services/rating-service.service';
import { Toy } from 'src/app/services/toy';
import { ToyService } from 'src/app/services/toy.service';

@Component({
  selector: 'app-landing-bought-together',
  templateUrl: './landing-bought-together.component.html',
  styleUrls: ['./landing-bought-together.component.scss']
})
export class LandingBoughtTogetherComponent implements OnInit {
  // @Input() bought_together_items: any;
  itemRatings: ItemRatings;
  amount_after_discount: any[] = []
  stockCount: number = 0;
  itemRatingsMap: Map<number, ItemRatings> = new Map<number, ItemRatings>();
  addedToCartFlagForLanding: boolean = false;
  isUserLoggedIn: any;
  ProductId: any;
  toysPaginated: Toy[] = [];
  bought_together_list: any[] = [];
  bought_together_items: Toy[] = [];
  bought_together_discount: number = 0;

  constructor(private router: Router,
    private ratingService: RatingService,
    private cartService: CartService,
    private authService: AuthenticationService,
    private bought_together_service: BoughtTogetherService,
    public route: ActivatedRoute,
    public toyService: ToyService,
  ) {
    this.authService.isUserLoggedIn.subscribe((val) => {
      this.isUserLoggedIn = val;
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.ProductId = params.get("itemId");
    });
    this.getToys();
  }

  getToys() {
    this.toyService.getAllToys().subscribe(toys => {
      this.toysPaginated = [...toys];
      this.getBoughtTogetherItem()
    });
  }

  getBoughtTogetherItem() {
    this.bought_together_service.getBoughtTogetherByItemId(this.ProductId).subscribe(boughtTogetherItem => {
      this.bought_together_list = boughtTogetherItem[0]?.items
      this.bought_together_discount = boughtTogetherItem[0].discountPercent;
      this.bought_together_items = this.toysPaginated.filter(toyitem => this.bought_together_list?.some(boughtItem => boughtItem?.itemId == toyitem.id));
      this.getItemRatingByLoop()
      this.updateCart()
    })
  }



  getItemRatingByLoop() {
    this.bought_together_items.forEach(item => this.itemRating(item));
  }

  openProduct(item) {
    this.router.navigate(['product', item?.id]);
  }

  hasDiscount(discount: any): boolean {
    if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
      return false;
    }
    return true;
  }

  calculateDiscountedPrice(amount: number, percentVal: number) {
    const dis_amount = Math.round(amount * ((100 - percentVal) / 100));
    this.amount_after_discount.push(dis_amount)
    return dis_amount
  }

  isOutofStock() {
    return !(this.stockCount > 0);
  }

  itemRating(item) {
    this.ratingService.getItemRating(item.id).subscribe(val => {
      this.itemRatingsMap.set(item.id, val);
    });
    this.ratingService.fetchItemRating(item.id);
  }

  getSubTotalAmount() {
    let subTotal: number = 0;
    this.bought_together_items.forEach(item => {
      if (item?.price) {
        subTotal += item.price.amount;
      }
    });
    return subTotal;
  }

  getDiscountAmount() {
    let subTotalDiscount: number = 0;
    this.bought_together_items.forEach(item => {
      if (item?.discount) {
        subTotalDiscount += (item.discount.discountPercent / 100) * item.price.amount;
      }
    });
    return subTotalDiscount
  }

  getTotalAmount() {
    return Math.round(this.getSubTotalAmount() - this.getDiscountAmount());
  }

  getBoughtTogetherDicount() {
    return (this.getTotalAmount()) - (this.getTotalAmount() * (this.bought_together_discount / 100))
  }

  addToCart() {



    // just delegate to add to cart service. 
    let addedFlag: boolean;
    this.bought_together_items.forEach(boughtItem => {




      this.cartService.addToCart(Number(this.authService.getUserId()), {
        "id": undefined,
        "itemId": boughtItem.id,
        "name": boughtItem.name,
        "quantity": Number(1),
        "tax": 18,
        "price": boughtItem.price,
        "discount": boughtItem.discount?.discountPercent,
        "variationId": (boughtItem.variations!==null && boughtItem.variations.length>0)?boughtItem.variations[0].id:null
      }).subscribe((val) => {
        addedFlag = val;
        if (addedFlag) {
          this.addedToCartFlagForLanding = true;

        }
      });
    });
  }

  hasUserLoggedIn() {
    return this.isUserLoggedIn === "true";
  }

  viewInCart() {
    this.router.navigate(["/checkout"])
  }

  allItemsExist(cartItem: any[]): boolean {
    // Iterate through each item in bought_together_items
    for (const bought_item of this.bought_together_items) {
      let exists = false;
      // Check if the item exists in cartItem
      for (const cart_item of cartItem) {
        if (cart_item.itemId === bought_item.id) {
          exists = true;
          break; // If the item is found, no need to continue searching
        }
      }
      // If the item doesn't exist in cartItem, return false
      if (!exists) {
        return false;
      }
    }
    // If all items exist in cartItem, return true
    return true;
  }

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.addedToCartFlagForLanding = this.allItemsExist(val.items);
    });
  }


}
