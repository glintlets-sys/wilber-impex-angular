import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { PaymentDoneComponent } from '../payment-done/payment-done.component';
import { Address } from 'src/app/services/address.service';
import { Location } from '@angular/common';
import { take } from 'rxjs';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
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
  @Output() set_cart_label: EventEmitter<string> = new EventEmitter();
  public couponCode: string;
  public couponCodePass: string;
  private catalogItems: Toy[];
  user_address: Address;
  taxPercent: number = 0;
  public encryptionRequest = "";


  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private paymentService: PaymentService,
    private phonepePaymentService: PhonePePaymentService,
    private encryptionService: EncryptionService,
    private loadingService: LoadingOverlayService,
    private toaster: ToasterService,
    private catalogService: CatalogService,
    private couponService: CouponService,
    private location: Location
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cartService.initCartForLoggedInUser();

    this.authService.isUserLoggedIn.subscribe((val => {
      this.isLoggedIn = (val === "true");
      this.loadingService.showLoadingOverlay("Loading your cart items ... ", 5000);
      this.updateCart();
    }));

    //this.updateCart();
    this.authService.userDetails.subscribe(val => {
      this.userId = JSON.parse(val).userId;
    })


    let userDetails: any = {}
    this.userService.getUserByUsername(JSON.parse(localStorage.getItem("userDetails")).username).subscribe(val => {
      userDetails = val;
    })

    // TODO: commenting this for now. Use this method later to upgrade and get this information from backend for the app. So that there can be contingent hold on sales on emergency 
    this.checkDisableCondition();
    this.accessCode = environment.ACCESS_CODE;
    this.couponCodePass = localStorage.getItem('couponCode')
    // if (this.couponCodePass != null) {
    //   localStorage.removeItem('couponCode')
    // }
    this.getSelectedAdress()
  }

  //This is test code. 
  checkDisableCondition(): void {
    const shouldDisable: boolean = !this.authService.isUserAdmin();
    this.isButtonDisabled = shouldDisable;
  }

  continueToAddress() {
    this.paymentWizard = "address";
  }

  paymentComplete(): void {
    this.toaster.showToast("Thanks for your interest. We are launching soon. Redirecting to Test payment gateway. ", ToastType.Info, 3000);
    setTimeout(() => {
      this.processPayment_phonepe();
    }, 1000);
  }

  getSelectedAdress() {
    this.paymentService.getSelectedAddress().subscribe(val => {
      this.user_address = val;
    })
  }

  getSubTotalAmount() {
    return this.paymentService.getSubTotalAmount();
  }

  getTotalTax() {
    return this.paymentService.getTotalTax();
  }

  getCouponDiscountAmount() {
    return this.paymentService.getCouponDiscount();
  }

  getDiscountAmount() {
    return this.paymentService.getDiscountAmount();
  }

  getTotalAmount() {
    return this.paymentService.getTotalAmount()
  }

  getCouponCodeApplied() {
    return this.paymentService.isCouponApplied();
  }

  getTotalMrpAmount(){
    return this.paymentService.getMRPAmount();
  }

  updateCart(): void {
    this.cartService.getCart().subscribe(val => {
      this.cartItems = val.items;
      this.catalogService.getCatalogList().subscribe(val => {
        this.catalogItems = val;
      })
      this.loadingService.hideLoadingOverlay();
    });
  }

  searchItem(itemId: number): string | undefined {
    const item = this.catalogItems.find((toy) => toy.id === itemId);
    if (item) {
      return item.photoLinks[0];
    }
    return undefined;
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


  /**
   * New code begins. 
   * 
   * 
   */




  /**
   *  S T E P S   T O   P R O C E S S   P A Y M E N T 
   * 
   * AUTH SERVICE
   * Review the auth service and clean it up to start.  -- done 
   * Clean up cart - need not use the local storage at all -- done
   * 
   * UPDATES TO CART MANAGMENT -- done ( scheduler is stil missing - out of stock is still missing.)
   * 
   * 1. Ensure the items are locked when an item is added to cart.  -- done 
   * 2. If an item cannot be locked, these items need to show as out of stock. Add remove add to cart button and show out of stock message on the item.  - done 
   * 3. Handle the case when an item quantity is increased. - in this case just show the toaster message and do not increase the quantity in the cart. -- done 
   * 4. Ensure that when an item is added to the cart, its corresponding stock item is locked for cart & add to cart indicator clearly shows that.  -- done 
   * 5. Stock status is updated from available to added to cart . user id is capured along with when it was added.  -- done 
   * 6. cart need not store anything in the localstorage its unwanted overhead.  -- done
   * 7. when scheduler runs, it checks items in cart and if any of them ar expired just remove them from the lock of the customer.   -- tbd. Code available but need to check. Also need to impleemnt optimistic lock. 
   * 8. Cart should store any cart summary at all. Cart summary should be built cached and sent to customer. storing this leads to inconsistencies. its rather simpler design. And is clearly doing all the work. 
   *  when i move the stock to processing payment and then subsequently to payment success , along with the user name is quite a clean design.  -- done. 
   * 
   * 
   * ON PROCEED TO PAYMENT
   * 
   * 1. When user initiate a call to proceed to payment. 
   *    -> update the cart -> to ensure if there is any inconsistency. This is rare case scenario - throw a toaster and stop the process. - done. 
   *    -> if no discripancy 
   *        -> call -> proceed to payment backend service. 
   *            -> send the payment summary json to backend. 
   *                      -> sumamry is just not the stock details. its about 
   *                            -> discounts applied to a stock. 
   *                            -> actual price the item is sold. 
   *                            -> actual tax collected on the stock. 
   *                            -> any thing further such as free items etc in future design perspective. 
   *                            -> captures the address to which this item to be delivered. 
   *                  -> store the payment summary ang generate a order number. Populate the order number as id of customer + item ids of the items he purchased + date & time ( with the help of summary ) - encrypt to base64
   *            -> this api should update the stock table against the user to -> mark for purchase. So these items cannot be deleted by any scheduler. 
   *            -> update the stock items with the order number. 
   *            -> respond with order number back to the calling api on front end  - done 
   *    -> if it fails 
   *          -> throw error. 
   *          -> if success 
   *              -> get the encryption summary for payment 
   *                    -> encrypt it. 
   *              -> redirect to payment gateway with order id. -- next step. 
   *    -> if the payment completes 
   * 2. Recieve redirect to the payment-response service.  
   *      -> if success
   *            -> mark the purchase summary to sucess. date and time. with amont recieved. As this may be different from requested amount. There is a deduction at the payment gateway. 
   *            -> update stock table with ths order number items marked as sold. 
   *       -> if failure. 
   *            -> No need to delete the order number row in the payment summary table. Mark the order number as failed. 
   *            -> remove mark on the stock back to add to cart against this order number. 
   * 
   *        -> a scheduler can clear all order entries and do teh above 2 operation if the time of order placed is more than 2 hours ( this is to handle the failed payment in transit and release the held up stock.) this scheduler should run every 5 mins. 
   *    
   * 
   *        -> redirect back to the UI based on sucess or failure. Navigate to order page. 
   * 
   * 3. Order page
   *      1. should simply display table from 
   *              -> order summary 
   *                      order id, order status ( success or processing payment or failed payment etc. ), 
   * 
   *      2. create a order detail table and keep pushing data against this order. 
   *              -> this table will ahve only creates no updates. 
   *              -> display the events in this table such as 
   *                    -> preparing for dispatch 
   *                    -> waiting to collect. 
   *                    -> dispatched with order details. 
   *                    -> order delivered confirmation etc. 
   *                    -> if possible any feeds from the scheduler from the courier gateway service. 
   * 
   * */


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

          // this.toaster.showToast("The cart is upto date. All items in stock!", ToastType.Success, 3000);
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
    localStorage.removeItem("couponCode");
    this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
  
    // Fetch the current cart and take only the first emission
    this.cartService.getCart().pipe(
      take(1) // Take only the first emission
    ).subscribe({
      next: (cartOld) => {
        // Copy the old cart
        const oldCart = JSON.parse(JSON.stringify(cartOld));
  
        // Refresh the cart
        this.cartService.refreshCart();
  
        // Fetch a new cart and take only the first emission
        this.cartService.getCart().pipe(
          take(1) // Take only the first emission
        ).subscribe({
          next: (cartNew) => {
            // Compare the old cart to the new cart
            if (JSON.stringify(cartNew) !== JSON.stringify(oldCart)) {
              this.loadingService.hideLoadingOverlay();
              this.toaster.showToast("Some of the cart items are out of stock. Please review and proceed for payment", ToastType.Error, 3000);
            } else {
              // Proceed to store the purchase summary and generate the order ID for payment redirect
              this.paymentService.initiatePayment().subscribe({
                next: (response) => {
                  // Handle the response here
                  this.orderId = response;
                  localStorage.setItem("completedOrderId", this.orderId);
                  
                  // Now that the order details are stored, initiate the payment
                  this.toaster.showToast("Redirecting to Payment gateway", ToastType.Info, 5000);
                  this.phonepePaymentService.makePaymentThroughBackend(this.orderId);
                },
                error: (error) => {
                  // Handle any errors that occur during the request
                  console.error('Error:', error);
                  this.toaster.showToast("Something went Wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", ToastType.Error, 3000);
                },
                complete: () => {
                  this.loadingService.hideLoadingOverlay();
                }
              });
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
        console.error('Error fetching old cart:', error);
        this.loadingService.hideLoadingOverlay();
        this.toaster.showToast("Something went wrong while processing your cart. Please try again.", ToastType.Error, 3000);
      }
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
    }, 2000); // Delay of 1 second (1000 milliseconds)

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
    this.cartService.deleteCartItem(Number(this.userId), cartItem.itemId).subscribe(val => {
      if (val) {
        cartItem.quantity = 0;
      }
    });
  }

  incrementQuantity(cartItem: any): void {
    let cartItemCopy = JSON.parse(JSON.stringify(cartItem));
    cartItemCopy.quantity++;
    this.cartService.addToCart(Number(this.userId), cartItemCopy).subscribe(val => {
      if (val) {
        //cartItem.quantity++;
      } else {
        cartItem.quantity--;
      }
    });
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
  }

  setCartLabel(message: string) {
    this.set_cart_label.emit(message)
  }

}
