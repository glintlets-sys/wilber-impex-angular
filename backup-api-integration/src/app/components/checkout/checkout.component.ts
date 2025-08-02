import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { PaymentFields } from 'src/app/services/payment-fields';
import { environment } from 'src/environments/environment';
import { enc, MD5, AES } from 'crypto-js';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { CatalogService } from 'src/app/services/catalog.service';
import { Toy } from 'src/app/services/toy';
import { CouponService } from 'src/app/services/coupon.service';
import { PhonePePaymentService } from 'src/app/services/phone-pe-payment.service';
import { Location, LocationStrategy } from '@angular/common';
import { CouponApplicationResponse } from 'src/app/services/coupon';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userId = '';
  cartItems: any[] = [];
  totalAmount = 0;
  discountCode = '';
  deliveryAddress: any = {};
  accessCode: string = "";
  orderId: string = "";
  paymentWizard: string = "cart";

  isButtonDisabled: boolean = false;
  couponApplicationResponse: CouponApplicationResponse;
  couponCode: string;
  couponCodePass: string;
  taxPercent: number = 0;
  private catalogItems: Toy[];
  public encryptionRequest = "";
  wishList: any[] = [];

  //This is test code. 
  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private paymentService: PaymentService,
    private phonepePaymentService: PhonePePaymentService,
    private encryptionService: EncryptionService,
    private loadingService: LoadingOverlayService,
    private toaster: ToasterService,
    private catalogService: CatalogService,
    private couponService: CouponService,
    private location: Location,
    private locationService: Location,
    private locationstrategy: LocationStrategy

  ) { }

  ngOnInit(): void {
    this.cartService.initCartForLoggedInUser();

    this.authService.isUserLoggedIn.subscribe((val => {
      this.isLoggedIn = (val === "true");
      this.loadingService.showLoadingOverlay("Loading your cart items ... ", 5000);
      this.updateCart();
    }));

    this.authService.userDetails.subscribe(val => {
      this.userId = val.userId;
    })

    this.cartService.initCartForLoggedInUser();

    let userDetails: any = {}
    if(JSON.parse(localStorage.getItem("userDetails"))!== null) {
      this.userService.getUserByUsername(JSON.parse(localStorage.getItem("userDetails")).username).subscribe(val => {
        userDetails = val;
      })
    }
    

    // TODO: commenting this for now. Use this method later to upgrade and get this information from backend for the app. So that there can be contingent hold on sales on emergency 
    this.checkDisableCondition();
    this.accessCode = environment.ACCESS_CODE;

    this.couponService.getCouponApplied().subscribe((val: CouponApplicationResponse) => {
      this.couponApplicationResponse = val;
    })

    const wishListArray = localStorage.getItem("localStorageWishList");
    if (wishListArray) {
      this.wishList = JSON.parse(wishListArray)
    }
  }

  continueToAddress() {

   
    if(this.userId == undefined) {
      const returnUrl = this.router.url;
      this.router.navigate(['login'], { queryParams: { returnUrl } });
    }

    if (this.cartItems?.length == 0) {
      this.toaster.showToast("No items in cart", ToastType.Success, 3000);
      return
    }
    this.redirectToGetLabel("address")
  }

  checkDisableCondition(): void {
    const shouldDisable: boolean = !this.authService.isUserAdmin();;
    this.isButtonDisabled = shouldDisable;
  }

  getSubTotalAmount() {
    return this.paymentService.getSubTotalAmount();
  }

  getTotalTax() {
    return this.paymentService.getTotalTax();
  }

  getDiscountAmount() {
    return this.paymentService.getDiscountAmount();
  }

  getCouponDiscountAmount() {
    return this.paymentService.getCouponDiscount();
  }

  getTotalAmount() {
    return this.paymentService.getTotalAmount()
  }

  getCouponCodeApplied() {
    return this.paymentService.isCouponApplied();
  }

  getTotalMrpAmount() {
    return this.paymentService.getMRPAmount();
  }

  applyCouponCode() {
    this.couponCodePass = this.couponCode;
    this.paymentService.applyCoupon(this.couponCodePass);
  }

  clearCouponCode() {
    this.couponCode = undefined;
    this.couponCodePass = undefined;
    this.paymentService.resetCouponCodeApplied();
  }

  isCatalogLoading: boolean = false;
  updateCart(): void {
    console.trace('Stack trace for updateCart call');
    this.cartService.getCart().subscribe(val => {
      this.cartItems = val.items;
      console.log(this.cartItems);
      if(this.catalogItems == undefined && !this.isCatalogLoading) {
        this.isCatalogLoading = true;
        this.catalogService.getCatalogList().subscribe(val => {
          this.isCatalogLoading = false;
          this.catalogItems = val;
        })
      } 
      this.loadingService.hideLoadingOverlay();
    });
    
  }

  /*fetchImageForItem(itemId: number): string | undefined {
    const item = this.catalogItems.find((toy) => toy.id === itemId);
    if(!item) {
      this.catalogService.getCatalogItem(itemId).subscribe(val=>{
      });
    }
    if (item) {
      return item.photoLinks ? item.photoLinks[0] : null;
    }
    return undefined;
  }*/

private fetchRequests = new Map<number, boolean>();

fetchImageForItem(itemId: number): string | undefined {
  const item = this.catalogItems.find((toy) => toy.id === itemId);

  // If the item exists, return the photo link if available.
  if (item) {
    return item.photoLinks ? item.photoLinks[0] : null;
  }

  // If there is already a request for this item in progress, do nothing.
  if (this.fetchRequests.has(itemId)) {
    return undefined;
  }

  // Mark that a request for this item is in progress.
  this.fetchRequests.set(itemId, true);

  // Fetch the item from the catalog service and update the catalogItems list.
  this.catalogService.getCatalogItem(itemId).subscribe({
    next: (val) => {
      this.catalogItems.push(val);
      // Remove the itemId from the fetchRequests map once the item is retrieved.
      this.fetchRequests.delete(itemId);
    },
    error: (err) => {
      console.error('Failed to fetch catalog item:', err);
      // Remove the itemId from the fetchRequests map on error.
      this.fetchRequests.delete(itemId);
    }
  });

  return undefined;
}


  getVariation(cartItem: any){
    const item = this.catalogItems.find((toy) => toy.id === cartItem.itemId);
   // console.log("Item variations " + JSON.stringify(item));
    if(item) {
      
      return (item.variations!== null && item.variations.length>0) ? item.variations.find(variation => variation.id === cartItem.variationId) 
      : null;
    }
  }

  getAccessCode() {
    return environment.ACCESS_CODE;
  }

  getEncryptionRequest(): void {
    if (this.encryptionRequest == "") {
      const encKey = environment.WORKING_KEY;
      let paymentFields: PaymentFields = this.paymentService.getPaymentFields(this.orderId); // Get this value from the payment service.
      let requestData = this.constructRequestData(paymentFields);

      this.encryptionService.encryptData(requestData).subscribe(
        (data: any) => {
          this.encryptionRequest = data.encryptedRequest;
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  processPayment_new(): void {
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);

    this.cartService.getCart().subscribe((cartOld) => {
      // Copy the old cart
      const oldCart = JSON.parse(JSON.stringify(cartOld));

      // Refresh the cart
      this.cartService.initCartForLoggedInUser();

      // Get the new cart
      this.cartService.getCart().subscribe((cartNew) => {
        // Compare the old cart to the new cart
        if (JSON.stringify(cartNew) !== JSON.stringify(oldCart)) {
          this.loadingService.hideLoadingOverlay();
          this.toaster.showToast("Some of the cart items are out of stock. Please review and proceed for payment", ToastType.Error, 3000);
        } else {
          // proceeding to store the purchase summary and generating the order id for payment redirect.  
          this.paymentService.initiatePayment().subscribe(
            (response) => {
              // Handle the response here
              this.orderId = response;
              // Now that the order details are stored. Initiate the payment. 
              this.processPayment();
            },
            (error) => {
              // Handle any errors that occur during the request
              console.error('Error:', error);
              this.toaster.showToast("Something went Wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", ToastType.Error, 3000);
            });;
          this.loadingService.hideLoadingOverlay();
        }
      });
    });
  }

  /**
   * Phone pe payment 
   */


  public processPayment_phonepe() {
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
  
    // Fetch the current cart
    this.cartService.getCart().subscribe({
      next: (currentCart) => {
        // Store a copy of the current cart for comparison
        const oldCart = JSON.parse(JSON.stringify(currentCart));
  
        // Flag to prevent repeated initialization
        let isCartInitialized = false;
  
        // Initialize the cart for the logged-in user (perform necessary updates)
        this.cartService.initCartForLoggedInUser();
  
        // Immediately fetch the new cart after initialization
        this.cartService.getCart().subscribe({
          next: (newCart) => {
            // Only compare if the cart was not initialized previously
            if (!isCartInitialized) {
              isCartInitialized = true; // Set the flag to prevent further initializations
  
              // Compare the old cart to the new cart
              if (JSON.stringify(newCart) !== JSON.stringify(oldCart)) {
                this.loadingService.hideLoadingOverlay();
                this.toaster.showToast("Some of the cart items are out of stock. Please review and proceed for payment", ToastType.Error, 3000);
              } else {
                // Proceed to store the purchase summary and generate the order ID for payment redirect
                this.paymentService.initiatePayment().subscribe({
                  next: (response) => {
                    // Handle the response here
                    this.orderId = response;
                    this.toaster.showToast("Redirecting to Payment gateway", ToastType.Info, 5000);
                    // Uncomment to make payment through the backend
                    // this.phonepePaymentService.makePaymentThroughBackend(this.orderId);
                  },
                  error: (error) => {
                    console.error('Error:', error);
                    this.toaster.showToast("Something went wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", ToastType.Error, 3000);
                  },
                  complete: () => {
                    this.loadingService.hideLoadingOverlay();
                  }
                });
              }
            }
          },
          error: (error) => {
            console.error('Error fetching new cart:', error);
            this.loadingService.hideLoadingOverlay();
            this.toaster.showToast("Something went wrong while fetching the new cart. Please try again.", ToastType.Error, 3000);
          }
        });
      },
      error: (error) => {
        console.error('Error fetching cart:', error);
        this.loadingService.hideLoadingOverlay();
        this.toaster.showToast("Something went wrong while processing your cart. Please try again.", ToastType.Error, 3000);
      }
    });
  }
  

  public processPayment_phonepe_backup() {
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
    this.cartService.getCart().subscribe((cartOld) => {
      // Copy the old cart
      const oldCart = JSON.parse(JSON.stringify(cartOld));

      // Refresh the cart
      this.cartService.initCartForLoggedInUser();

      // Get the new cart
      this.cartService.getCart().subscribe((cartNew) => {
        // Compare the old cart to the new cart
        if (JSON.stringify(cartNew) !== JSON.stringify(oldCart)) {
          this.loadingService.hideLoadingOverlay();
          this.toaster.showToast("Some of the cart items are out of stock. Please review and proceed for payment", ToastType.Error, 3000);
        } else {

          // this.toaster.showToast("The cart is upto date. All items in stock!", ToastType.Success, 3000);
          // proceeding to store the purchase summary and generating the order id for payment redirect.  
          this.paymentService.initiatePayment().subscribe(
            (response) => {
              // Handle the response here
              this.orderId = response;
              // Now that the order details are stored. Initiate the payment. 
              this.toaster.showToast("Redirecting to Payment gateway", ToastType.Info, 5000);
          //    this.phonepePaymentService.makePaymentThroughBackend(this.orderId);
            },
            (error) => {
              // Handle any errors that occur during the request
              console.error('Error:', error);
              this.toaster.showToast("Something went Wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", ToastType.Error, 3000);
            });;
          this.loadingService.hideLoadingOverlay();
        }
      });
    });
  }

  /**
   * New code ends 
   */

  // Function to process payment
  processPayment(): void {

    const ccavenueForm = document.getElementById('ccavenueForm') as HTMLFormElement;
    this.getEncryptionRequest(); // make sure this is called to get the rquried data before we actually submit. 
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
    setTimeout(() => {
      ccavenueForm.submit();
      this.loadingService.hideLoadingOverlay();
    }, 3000); // Delay of 1 second (1000 milliseconds)

  }

  constructRequestData(paymentFields: PaymentFields) {
    const { merchantId, orderId, currency, amount, redirectUrl, cancelUrl, language } = paymentFields;
    let requestData = `merchant_id=${merchantId}`;

    // Construct required fields
    const requiredData = this.constructRequiredData(paymentFields);
    requestData += `&${requiredData}`;

    // Construct optional fields
    const optionalData = this.constructOptionalData(paymentFields);
    if (optionalData !== '') {
      requestData += `&${optionalData}`;
    }

    return requestData;
  }

  constructRequiredData(paymentFields: PaymentFields) {
    const { orderId, currency, amount, redirectUrl, cancelUrl, language } = paymentFields;

    let requiredData = `order_id=${orderId}&currency=${currency}&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;

    return requiredData;
  }

  constructOptionalData(paymentFields: PaymentFields) {
    const {
      billingName, billingAddress, billingCity, billingState, billingZip, billingCountry,
      billingTel, billingEmail, deliveryName, deliveryAddress, deliveryCity, deliveryState,
      deliveryZip, deliveryCountry, deliveryTel, merchantParam1, merchantParam2,
      merchantParam3, merchantParam4, merchantParam5, promoCode, tid
    } = paymentFields;

    let optionalData = '';
    if (billingName) optionalData += `billing_name=${billingName}&`;
    if (billingAddress) optionalData += `billing_address=${billingAddress}&`;
    if (billingCity) optionalData += `billing_city=${billingCity}&`;
    if (billingState) optionalData += `billing_state=${billingState}&`;
    if (billingZip) optionalData += `billing_zip=${billingZip}&`;
    if (billingCountry) optionalData += `billing_country=${billingCountry}&`;
    if (billingTel) optionalData += `billing_tel=${billingTel}&`;
    if (billingEmail) optionalData += `billing_email=${billingEmail}&`;
    if (deliveryName) optionalData += `delivery_name=${deliveryName}&`;
    if (deliveryAddress) optionalData += `delivery_address=${deliveryAddress}&`;
    if (deliveryCity) optionalData += `delivery_city=${deliveryCity}&`;
    if (deliveryState) optionalData += `delivery_state=${deliveryState}&`;
    if (deliveryZip) optionalData += `delivery_zip=${deliveryZip}&`;
    if (deliveryCountry) optionalData += `delivery_country=${deliveryCountry}&`;
    if (deliveryTel) optionalData += `delivery_tel=${deliveryTel}&`;
    if (merchantParam1) optionalData += `merchant_param1=${merchantParam1}&`;
    if (merchantParam2) optionalData += `merchant_param2=${merchantParam2}&`;
    if (merchantParam3) optionalData += `merchant_param3=${merchantParam3}&`;
    if (merchantParam4) optionalData += `merchant_param4=${merchantParam4}&`;
    if (merchantParam5) optionalData += `merchant_param5=${merchantParam5}&`;
    if (promoCode) optionalData += `promo_code=${promoCode}&`;
    if (tid) optionalData += `tid=${tid}`;

    return optionalData;
  }

  // Function to log in
  login(): void {
    const currentUrl = this.router.url;
    const redirectUrl = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
    this.router.navigateByUrl(redirectUrl);
  }

  getIsLoggedIn() {
    this.authService.isUserLoggedIn.subscribe((val => {
      this.isLoggedIn = (val === "true");
    }));
    return this.isLoggedIn;
  }

  removeItem(cartItem: any): void {
    this.cartService.deleteCartItem(Number(this.userId), cartItem).subscribe(val => {
      if (val) {
        cartItem.quantity = 0;
      }
    });

    this.clearCouponCode();

  }

  incrementQuantity(cartItem: any): void {
    let cartItemCopy = JSON.parse(JSON.stringify(cartItem));
    cartItemCopy.quantity++;
    this.cartService.addToCart(Number(this.userId), cartItemCopy).subscribe({
      next: (val) => {
        if (val) {
          // Logic for successful addition to cart, e.g., increment quantity
        } else {
          // Logic for when addition to cart is not successful, e.g., decrement quantity
          cartItem.quantity--;
        }
      },
      error: (err) => {
        cartItem.quantity--;
        // Handle the error here
        console.error("Failed to add item to cart:", err);
        // Optionally, you can also implement UI feedback here, like showing an error message to the user
      },
      complete: () => {
        // Any cleanup or final actions once the observable completes, if necessary
      }
    });

    if (this.couponCodePass) {
      this.applyCouponCode();
    }
  }

  decrementQuantity(cartItem: any): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      this.cartService.addToCart(Number(this.userId), cartItem).subscribe(val => {
        if (val) {
          // cartItem.quantity--;
        } else {
          cartItem.quantity++;
        }
      });
    }
    if (this.couponCodePass) {
      this.applyCouponCode();
    }
  }

  redirectToGetLabel(message: string) {
    if (this.cartItems?.length == 0) {
      this.toaster.showToast("No items in cart", ToastType.Success, 3000);
      return
    }
    this.paymentWizard = message;
  }

  moveToWishList(cartItem) {
    this.wishList.push(cartItem);
    localStorage.setItem("localStorageWishList", JSON.stringify(this.wishList))
    this.cartService.deleteCartItem(Number(this.userId), cartItem).subscribe(val => {
    });
    this.clearCouponCode();
  }

  moveToCart(cartItem) {
    this.cartService.addToCart(Number(this.authService.getUserId()), {
      "id": undefined,
      "itemId": cartItem?.itemId,
      "name": cartItem.name,
      "quantity": Number(cartItem.quantity),
      "tax": 18,
      "price": cartItem.price,
      "discount": cartItem.discount?.discountPercent,
      "variationId": (cartItem.variationId!==null?cartItem.variationId:null)
    }).subscribe({
      next: (val) => {
        this.removeFromWishList(cartItem);
        this.updateCart();
      },
      error: (error) => {
      }
    });
    this.clearCouponCode();
  }

  removeFromWishList(cartItem) {

    const index = this.wishList.findIndex(wishItem => wishItem?.itemId === cartItem?.itemId && wishItem.variationId === cartItem?.variationId);
    if (index !== -1) {
      this.wishList.splice(index, 1);
    }
    localStorage.setItem("localStorageWishList", JSON.stringify(this.wishList))
  }

  ngOnDestroy(): void {
    this.clearCouponCode()
  }

}
