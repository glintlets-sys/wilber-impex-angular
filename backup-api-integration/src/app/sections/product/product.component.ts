import { Component, OnInit, Input, OnDestroy, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Cart, CartItem, CartService } from "src/app/services/cart.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { CatalogService } from "src/app/services/catalog.service";
import { Location } from "@angular/common";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModalComponent } from "src/app/shared/carousel-modal/carousel-modal.component";
import { LoadingOverlayComponent } from "src/app/shared/loading-overlay/loading-overlay.component";
import { LoadingOverlayService } from "src/app/services/loading-overlay.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter, catchError } from 'rxjs/operators';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { RatingService } from "src/app/services/rating-service.service";
import { ItemRatings } from "src/app/services/item-ratings";
import Swiper from "swiper";
import Element from "swiper"
import { register } from 'swiper/element/bundle';
import { ItemRecommendationService } from "src/app/services/item-recommendation.service";
import { Subscription } from "rxjs";
import { BoughtTogetherService } from "src/app/services/boughtTogetherService/bought-together.service";
import { ToyService } from "src/app/services/toy.service";
import { Toy } from "src/app/services/toy";
import { ToasterService } from "src/app/services/toaster.service";
import { ToastType } from "src/app/services/toaster";

@Component({
  selector: "app-product",
  templateUrl: "product.component.html",
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  itemId: any;
  isUserLoggedIn: any;
  item: any;
  categoryId: string | null = null;
  quantity = 1;
  breadcrumbItems = [
    // { label: 'Home', url: '/' },
    // { label: 'High Speed Magic Toy' },
  ];
  mainCarouselOptions: OwlOptions = {
    loop: true,
    items: 1,
    dots: false,
    nav: false,
    //... other options
  };

  thumbnailOptions: OwlOptions = {
    loop: true,
    margin: 10,
    items: 4,
    dots: false,
    nav: false,
    autoplay: true,       // Add this line to enable autoplay
    autoplayTimeout: 3000, // Add this line to set the delay. 3000ms = 3 seconds
    autoplayHoverPause: true, // Add this line to pause on hover
    autoplaySpeed: 500,      // Add this line if you want to set a specific speed for the transition
    //... other options
  };
  @ViewChild('mainCarousel') mainCarousel: CarouselComponent;
  ageCategory: string | null = null;
  uniquePreviewItem: any[] = []
  showViewAllButton: boolean = false;
  showAllReviews: boolean = false;
  reviewComment: any[] = []
  public stockCount: number = 0;
  itemRatings: ItemRatings;
  similarItemList: any[] = []
  private routeSubscription: Subscription;
  relatedItemList: any[] = []
  combinedList: any[] = [];
  modalRef: NgbModalRef | undefined; // Declare modalRef property
  activeTab: number = 0;
  commentsTab: number = 0;
  private addedToCartFlag: boolean = false;
  private nextItem: any;
  private isFetching = false; // Add this flag to track ongoing fetches
  video_list: any[] = [];
  ratings: any[];
  toggleReviewflag: boolean = false;
  toysPaginated: Toy[] = [];
  bought_together_list: any[] = [];
  bought_together_items: Toy[] = [];
  wishList: any[] = [];
  cart: Cart;
  cartItem: CartItem;
  variationId: number = null;
  selectedVariation: any = null;


  constructor(
    private authService: AuthenticationService,
    private loadingOverlay: LoadingOverlayService,
    private catalogService: CatalogService,
    private cartService: CartService,
    public route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private router: Router,
    private ratingService: RatingService,
    private sanitizer: DomSanitizer,
    private recommend_service: ItemRecommendationService,
    private bought_together_service: BoughtTogetherService,
    public toyService: ToyService,
    private toaster: ToasterService
  ) {
    this.authService.isUserLoggedIn.subscribe((val) => {
      this.isUserLoggedIn = val;
    })
    this.catalogService.uniqueItemArr$.subscribe(val => {
      this.uniquePreviewItem = val
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.paramMap.subscribe(params => {
        this.ageCategory = params.get('ageCategory');
      });
      this.initialize();
    });
  }

  ngOnInit() {
    this.initialize();
  }

  selectVariation(variation: any)
  {
    this.selectVariationWithItem(this.item, variation);
  }
  selectVariationWithItem(item: any, variation: any)
  {
    this.selectedVariation = variation;
    this.variationId = variation.id;
    const cartItem = this.cart?.items.find(
      (cartItem) =>
        Number(cartItem?.itemId) === Number(item?.id) &&
        (cartItem?.variationId === this.variationId)
    );
   // let cartItem = this.cart?.items.find((cartItem) => Number(cartItem?.itemId) === Number(item?.itemId));
    if (cartItem !== undefined) {
      this.cartItem = cartItem;
      this.quantity = cartItem.quantity;
      this.addedToCartFlag = true;
    } else{
      this.cartItem = undefined;
      this.addedToCartFlag = false;
      this.quantity = 1;
    }

    this.catalogService.getStockCountForVariation(this.itemId, this.variationId).subscribe(val=>{
      this.stockCount = val;
      }
    );
   
  }


  data: any[] = undefined;

  getTableData(item: any) {

    let tableDataObj = JSON.parse(item?.tableData);    
    if(this.data == undefined) {
      this.data = Object.keys(tableDataObj).map(key => ({
        key,
        value: tableDataObj[key]
      }));
    }
    return this.data;
  }

  initialize() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("product-page");
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.itemId = params.get('itemId');
    });

    this.item = undefined;
    this.getItem();


    this.ratingService.getItemRating(this.itemId).subscribe(val => {
      this.itemRatings = val;
    })

    this.route.queryParams.subscribe(params => {
      this.ageCategory = params['ageCategory'];
    });

    //TODO cache this too. 
   // this.catalogService.fetchStockCount(this.itemId);
    this.ratingService.fetchItemRating(this.itemId);

    this.cartService.getCart().subscribe(val => {
      this.cart = val;


  
        this.catalogService.getStockCountForVariation(this.itemId, this.variationId).subscribe(val=>{
          this.stockCount = val;
          }
        );
 
      
      let cartItem = this.cartService?.getCartItem({ "id": undefined, "itemId": this.itemId, "name": "", "quantity": 0, "tax": 0, "price": 0, "discount": 0, "variationId": this.variationId });
     // let cartItem = this.cart?.items.find((cartItem) => Number(cartItem?.itemId) === Number(item?.itemId));
      if (cartItem !== undefined) {
        this.cartItem = cartItem;
        this.quantity = cartItem.quantity;
      }

      if(cartItem !== undefined) {
        this.addedToCartFlag = true;
      }
    })
    this.getComment();
    this.getBoughtTogetherItem();
    const wishListArray = localStorage.getItem("localStorageWishList");
    if (wishListArray) {
      this.wishList = JSON.parse(wishListArray)
    }
  }

  getComment() {
    this.ratingService.getCommentsByToyId(this.itemId).subscribe(
      (ratings) => {
        this.reviewComment = ratings;
        this.showViewAllButton = this.reviewComment.length > 3;
      },
      (error) => {
        this.reviewComment = [];
      }
    );
  }

  toggleShowAll() {
    this.showAllReviews = !this.showAllReviews;
  }

  getBoughtTogetherItem() {
    this.bought_together_service.getBoughtTogetherByItemId(this.itemId).subscribe(boughtTogetherItem => {
      this.bought_together_list = boughtTogetherItem[0]?.items
    })
  }

  changeSlide(clickedSlideIndex: any) {
    this.mainCarousel.to(clickedSlideIndex);
  }

  // Load similar recommend list
  loadSimilarRecommendList(val: number) {
    this.recommend_service.getAllRelatedItems(val, 'SIMILAR').subscribe(val => {
      this.similarItemList = val;
      this.combinedList = val;
      this.combineRecommendLists();
    });
  }

  // Load related recommend list
  loadRelatedRecommendList(val: number) {
    this.recommend_service.getAllRelatedItems(val, 'RELATED').subscribe(val => {
      this.relatedItemList = val;
      this.combinedList = val;
      this.combineRecommendLists();
    });
  }

  // Combine similar and related recommend lists
  combineRecommendLists() {
    if (this.similarItemList && this.relatedItemList) {
      // Combine the arrays using spread operator
      this.combinedList = [...this.similarItemList, ...this.relatedItemList];
    }
  }

  extractVideoId(link: string): string {
    const matches = link.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})(?:\S+)?$/);

    if (matches && matches.length === 2) {
      return matches[1];
    } else {
      return 'DEFAULT_VIDEO_ID';
    }
  }

  generateSafeUrls(links: string[]): SafeResourceUrl[] {
    return links.map(link => this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.extractVideoId(link) + "?autoplay=1&origin=http://localhost:4200"));
  }

  openCarouselModal(photoLinks: string[], title: string) {
    const modalRef = this.modalService.open(CarouselModalComponent, { size: 'lg' });
    modalRef.componentInstance.photoLinks = photoLinks;
    modalRef.componentInstance.title = title;
    this.modalRef = modalRef;
    modalRef.closed.subscribe((result) => {
    });
  }

  hasUserLoggedIn() {
    return this.isUserLoggedIn === "true";
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  setCommentsTab() {
    this.activeTab = this.getItem()?.productDescription.length;
  }

  getPhotoLink(i: number) {
    return this.getItem().photoLinks[i];
  }

  calculateDiscountedPrice(amount: number, percentVal: number) {
    return Math.round(amount * ((100 - percentVal) / 100));
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



    // if (this.addedToCartFlag && (this.quantity < 4)) {
    //   this.cartService.addToCart(Number(this.authService.getUserId()), {
    //     "id": undefined,
    //     "itemId": this.item.id,
    //     "name": this.item.name,
    //     "quantity": Number(++this.quantity),
    //     "tax": 18,
    //     "price": this.item.price.amount,
    //     "discount": this.item.discount?.discountPercent
    //   });
    // } else {
    //   this.quantity++;
    // }

    if (!this.isAddedToCart() && this.stockCount > this.quantity) {
      this.quantity++;
      return;
    }

    if (this.stockCount <= 0) {
      return;
    }

    this.cartItem.quantity = this.cartItem.quantity + 1;
    this.loadingOverlay.showLoadingOverlay();
    this.cartService.addToCart(Number(this.authService.getUserId()), this.cartItem).subscribe({
      next: (val) => {
        if (val) {
        } else {
          this.quantity--;
        }
        this.loadingOverlay.hideLoadingOverlay();
      },
      error: (err) => {
        this.quantity--;
        this.loadingOverlay.hideLoadingOverlay();
      },
      complete: () => {
      }
    });

  }

  decreaseQuantity() {


    if (this.addedToCartFlag && this.cartItem.quantity == 1) {
      this.cartService.deleteCartItem(Number(this.authService.getUserId()), this.cartItem).subscribe(val => {
        if (val) {
          // do nothing. 
        }
      });

    } else if (this.addedToCartFlag) {
      this.decrementQuantity(this.cartItem);
    } else {
      this.quantity = this.quantity > 1 ? this.quantity - 1 : 1;
    }
  }

  decrementQuantity(cartItem: any): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.loadingOverlay.showLoadingOverlay();
      this.cartService.addToCart(Number(this.authService.getUserId()), cartItem).subscribe(val => {
        if (val) {
          // cartItem.quantity--;
          this.loadingOverlay.hideLoadingOverlay();
        } else {
          cartItem.quantity++;
          this.loadingOverlay.hideLoadingOverlay();
        }
      });
    }
  }

  public isAddedToCart() {
  
    if(this.cartItem !== undefined) {
      return true;
    }

    return false
  }

  public nextItemId() {

    if (this.nextItem == undefined) {
      this.catalogService.getNextItem(this.item.id).subscribe(val => {
        this.nextItem = val;
      })
    }
    return this.nextItem.id;
  }

  public addToCart() {

    if((this.item.variations!==null && this.item.variations.length>1) && (this.variationId == null)){
      this.toaster.showToast("Please select your color of the selected product", ToastType.Error, 3000);
      console.log("variation is not yet selected");
      return;
    }

    // just delegate to add to cart service. 
    let addedFlag: boolean;
    this.cartService.addToCart(Number(this.authService.getUserId()), {
      "id": undefined,
      "itemId": this.item.id,
      "name": this.item.name,
      "quantity": Number(this.quantity),
      "tax": 18,
      "price": this.item.price,
      "discount": this.item.discount?.discountPercent,
      "variationId": (this.variationId!==null && this.variationId>0)?this.variationId:null
    }).subscribe((val) => {
      addedFlag = val;
      if (addedFlag) {
        this.addedToCartFlag = true;
      }
    });
  }

  getItem() {
    if (this.item === undefined && !this.isFetching) {
      this.isFetching = true; // Set the flag to indicate a fetch is ongoing

      // Uncomment the following line if you want to show a loading overlay
      this.loadingOverlay.showLoadingOverlay("loading..", 5000);

      this.catalogService.getCatalogItem(this.itemId).subscribe((data) => {
        this.item = data;
        // this.recommend_service.recommendedItemForCustomer.next(this.item)
        this.catalogService.UpdatePreviousViewData(this.item)
        this.catalogService.filterPreviouseViewData(this.item)
        this.updateBreadcrumbLabel(this.item.name);
        if (this.item?.videoLinks?.length > 0) {
          this.generateVideo();
        }
        this.loadingOverlay.hideLoadingOverlay();
        this.isFetching = false;
        if(this.item.variations !== undefined && this.item.variations.length >0) {
          console.log("variations:" + JSON.stringify(this.item.variations));
          this.selectVariationWithItem(this.item, this.item.variations[0]);
        } else
        {
          this.catalogService.fetchStockCount(this.itemId);
          this.catalogService.getStockCount(this.itemId).subscribe(val => {
            this.stockCount = val;
          })
        }
      });
    }
    return this.item;
  }

  calculateHeight(): string {
    const aspectRatio = 9 / 16; // 16:9 aspect ratio
    return `${100 * aspectRatio}%`;
  }

  generateVideo() {
    this.item.videoLinks.forEach(element => {
      const videoId = this.extractVideoIdFromLink(element);
      const safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
      const video_arr = []
      video_arr.push({
        originalLink: element,
        embedLink: safeSrc
      });
      this.video_list = [...video_arr]
    });
  }

  private extractVideoIdFromLink(link: any): string {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:.*\/(?:v\/|e\/|u\/\w+\/|embed\/|v\/)?|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  }

  fetchCommentsByToyId(toyId: number) {
    if (this.ratings) {
      this.ratingService.getCommentsByToyId(toyId).subscribe(
        (ratings) => {
          this.ratings = ratings;
        },
        (error) => {
          this.ratings = [];
        }
      );
    }
    return this.ratings;
  }

  toggleReview() {
    this.toggleReviewflag = !this.toggleReviewflag;
  }

  public hasDiscount(discount: any): boolean {
    if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
      return false;
    }
    return true;
  }

  goBack() {
    this.location.back();
  }

  public getStockCount() {
    return this.stockCount;
  }

  public navigateToCatalog() {
    this.router.navigate(['/']);
  }

  public navigateToNextItem() {
    const nextItemId = this.nextItemId();
    this.router.navigate(['/product', this.nextItemId()]).then(() => {
      this.location.replaceState(`/product/${nextItemId}`);
      location.reload();
    });
  }

  public navigateToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  public navigateToCheckout() {
    if((this.item.variations!==null && this.item.variations.length>1) && (this.variationId == null)){
      this.toaster.showToast("Please select your color of the selected product", ToastType.Error, 3000);
      console.log("variation is not yet selected");
      return;
    }
    if(!this.addedToCartFlag)
    {
      this.addToCart();
    }
    
    this.router.navigate(['checkout']);
  }

  updateBreadcrumbLabel(newTitle: string) {
    const bread_crumb_url = localStorage.getItem("breadCrumbUrl")
    this.breadcrumbItems = []
    if (bread_crumb_url) {
      this.breadcrumbItems = JSON.parse(bread_crumb_url)
    }
    if (this.breadcrumbItems?.length == 0) {
      this.breadcrumbItems.push(
        { label: 'Home', url: '/' },
        { label: newTitle },
      )
    } else {
      this.breadcrumbItems.push({ label: newTitle })
    }
  }

  ngAfterViewInit() {
    register();
    this.loadSimilarRecommendList(this.itemId)
    this.loadRelatedRecommendList(this.itemId)
    setTimeout(() => {
      this.initializeSwipers();
    }, 1000)

  }

  initializeSwipers() {
    var swiper = new Swiper(".mySwiper", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,

      grabCursor: true,
    });
    var swiper2 = new Swiper(".mySwiper2", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 2000,
        // disableOnInteraction: true,
      },
      loop: true,
      grabCursor: true,
      thumbs: {
        swiper: swiper,
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 1,
        },
        2000: {
          slidesPerView: 1,
        },
      },
    });

    let swiperTrending: Swiper = new Swiper(".trendingswiper", {
      autoplay: {
        delay: 2000,
        // disableOnInteraction: true,
      },
      loop: true,
      //   grabCursor: true,
      spaceBetween: 10,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        300: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1100: {
          slidesPerView: 4,
        }
      },
    });

    document.querySelector('.swiper-button-next').addEventListener('click', () => {
      if (swiperTrending) {
        swiperTrending.slideNext();

      }
    });

    document.querySelector('.swiper-button-prev').addEventListener('click', () => {
      if (swiperTrending) {
        swiperTrending.slidePrev();
      }
    });

  }

  favourite(val) {
    if (val == 0) {
      let cartItem = {
        "id": null,
        "itemId": this.item.id,
        "name": this.item.name,
        "quantity": Number(this.quantity),
        "tax": 18,
        "price": { amount: this.item.price.amount, currency: "INR", id: null },
        "discount": this.item.discount?.discountPercent
      }
      this.wishList.push(cartItem);
      localStorage.setItem("localStorageWishList", JSON.stringify(this.wishList))
    }
    else {
      const index = this.wishList.findIndex(wishItem => wishItem?.itemId === Number(this.itemId));
      if (index !== -1) {
        this.wishList.splice(index, 1);
      }
      localStorage.setItem("localStorageWishList", JSON.stringify(this.wishList))
    }
  }

  validateWishList() {
    return this.wishList.find(wishListItem => wishListItem.itemId == this.itemId)
  }

  ngOnDestroy() {
    this.video_list = [];
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("product-page");
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    localStorage.removeItem("breadCrumbUrl")
  }

}
