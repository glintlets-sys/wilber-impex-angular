import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { CartService } from './cart.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

import { environment } from 'src/environments/environment';
import { PaymentFields } from './payment-fields';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
import { LoadingOverlayService } from './loading-overlay.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Address } from './address.service';
import { ConfigService } from './config.service';
import { UrlService } from './url.service';
import { CouponApplicationResponse, CouponRequest } from './coupon';
import { CouponService } from './coupon.service';

const SERVICE_URL = environment.serviceURL;
const MERCHANT_ID = environment.MERCHANT_ID;



@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  private userDetails: any;
  private cartSummary: any;
  private authUser: any;

  private paymentwizard: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  public paymentWizardObject$ = this.paymentwizard.asObservable();
  private couponApplicationResponse: CouponApplicationResponse;

  public updatePaymentWizard(step: string) {
    this.paymentwizard.next(step);
  }

  private backendUrl = SERVICE_URL + 'api/purchases'; // Replace with your backend API URL

  private selectedAddressSubject: BehaviorSubject<Address | undefined> = new BehaviorSubject<Address | undefined>(undefined);
  private selectedAddress: Address;
  public setSelectedAddress(address: Address): void {
    this.selectedAddressSubject.next(address);
  }

  public getSelectedAddress(): Observable<Address | undefined> {
    return this.selectedAddressSubject.asObservable();
  }

  constructor(private authService: AuthenticationService,
    private configService: ConfigService,
    private couponService: CouponService,
    private urlService: UrlService,
    private toaster: ToasterService,
    private loadingService: LoadingOverlayService,
    private userService: UserService, private cartService: CartService, private http: HttpClient, private route: ActivatedRoute, private router: Router) {

    if(localStorage.getItem("userDetails")){
      this.userService.getUserByUsername(JSON.parse(localStorage.getItem("userDetails")).username).subscribe(val => {
        this.userDetails = val;
      })
    }
    

    this.cartService.getCart().subscribe(val => {
      this.cartSummary = val;
    })

    this.authService.getUserId()

    this.getSelectedAddress().subscribe(val => {
      this.selectedAddress = val;
    })

    this.couponService.getCouponApplied().subscribe((val: CouponApplicationResponse) => {
      this.couponApplicationResponse = val;
    })

  }


  /**
   * Initiate Make payment 
   */

  public initiatePayment(): Observable<any> {

    // Send cart details. As the cart should not change during the payment. 
    // Send the address details. 
    // Send the price at which the deal was done. for the audit and calculations. 
    // Ensure that the items in the cart stock are locked for purchased against the purchase token. 
    // Once a response is recieved from backend 
    // make a dummy call to backend api -> so that payment is success or failure. 
    // On success -> read the purchase token and mark the stock to purchased. 
    //  -> update the order table wit order items with purchase details. & address details. 
    // redirect to success on the UI. 

    let purchaseSummary: any = this.preparePurchaseSumamry();
    if (purchaseSummary === undefined) {
      //this.toaster.showToast("Something went wrong !", ToastType.Error,3000);
      return;
    }
    return this.prepareOrderNumberForPurchase(purchaseSummary);

  }

  value: any;

  prepareOrderNumberForPurchase(purchaseSummary: string): Observable<any> {

    let requestBody = {
      "username": this.authService.getUsername(),
      "userId": this.authService.getUserId(),
      "purchaseSummary": purchaseSummary,
      "couponUsageId": this.couponApplicationResponse != null ? this.couponApplicationResponse.couponUsageId : null
    };

    return this.http.post<any>(`${this.backendUrl}`, requestBody, { responseType: 'text' as 'json' });

  }

  getPaymentFields(paymentSummaryOrderId: string) {
    return this.createPaymentFields(paymentSummaryOrderId);
  }

  private originUrl = "";
  private tenant: string = "";


  initializeTenant() {
    // 1. Get origin URL
    this.originUrl = this.urlService.getOriginUrl();
    // 2. Get tenant details
    try {
      this.tenant = this.configService.getTenantDetails();
    } catch (error) {
      //console.error('Failed to load tenant details:', error);
    }
  }


  public createPaymentFields(paymentSummaryOrderId: string): PaymentFields {


    const merchantId = MERCHANT_ID; // Read merchantId from environment variable
    if (!merchantId) {
      throw new Error('Merchant ID not found in environment variables.');
    }

    const paymentFields: PaymentFields = {
      merchantId: merchantId,
      orderId: paymentSummaryOrderId,
      currency: 'INR', // Currently Supporting only INR
      amount: this.getTotalAmount().toString(), // Fill in the value for amount
      redirectUrl: environment.REDIRECT_URL, // Fill in the value for redirect_url
      cancelUrl: environment.CANCEL_URL, // Fill in the value for cancel_url
      language: 'en', // Fill in the value for language
      //TBD
      billingName: this.userDetails.name, // Fill in the value for billing_name (optional)
      billingAddress: this.selectedAddress.firstLine + " " + this.selectedAddress.secondLine, // Fill in the value for billing_address (optional)
      billingCity: this.selectedAddress.city, // Fill in the value for billing_city (optional)
      billingState: this.selectedAddress.state, // Fill in the value for billing_state (optional)
      billingZip: this.selectedAddress.pincode, // Fill in the value for billing_zip (optional)
      billingCountry: this.selectedAddress.country, // Fill in the value for billing_country (optional)
      billingTel: this.selectedAddress.mobileNumber, // Fill in the value for billing_tel (optional)
      billingEmail: this.selectedAddress.emailAddress, // Fill in the value for billing_email (optional)

      deliveryName: this.userDetails.name, // Fill in the value for delivery_name (optional)
      deliveryAddress: this.selectedAddress.firstLine + " " + this.selectedAddress.secondLine, // Fill in the value for delivery_address (optional)
      deliveryCity: this.selectedAddress.city, // Fill in the value for delivery_city (optional)
      deliveryState: this.selectedAddress.state, // Fill in the value for delivery_state (optional)
      deliveryZip: this.selectedAddress.pincode, // Fill in the value for delivery_zip (optional)
      deliveryCountry: this.selectedAddress.country, // Fill in the value for delivery_country (optional)
      deliveryTel: this.selectedAddress.mobileNumber, // Fill in the value for delivery_tel (optional)
      merchantParam1: this.originUrl, // Fill in the value for merchant_param1 (optional)
      merchantParam2: this.tenant, // Fill in the value for merchant_param2 (optional)
      merchantParam3: '', // Fill in the value for merchant_param3 (optional)
      merchantParam4: '', // Fill in the value for merchant_param4 (optional)
      merchantParam5: '', // Fill in the value for merchant_param5 (optional)
      promoCode: '', // Fill in the value for promo_code (optional)
      tid: this.generateOrderNumber(), // Fill in the value for tid (optional)
    };

    return paymentFields;
  }

  private generateOrderNumber(): string {
    const characters: string = '0123456789';
    const length: number = 10;

    let orderNumber: string = '';
    for (let i: number = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      orderNumber += characters.charAt(randomIndex);
    }

    return orderNumber;
  }

  private preparePurchaseSumamry() {
    let purchaseSummary: any = {};

    // add delivery address; TODO: The delivery address needs to be saved for future selections. 
    purchaseSummary.customerName = this.userDetails.name;
    //purchaseSummary.address = JSON.parse(JSON.stringify(this.userDetails.address));
    if (this.selectedAddress === undefined) {
      this.loadingService.hideLoadingOverlay();
      this.toaster.showToast("Please select Address ", ToastType.Error, 3000);
      return undefined;
    }
    purchaseSummary.address = this.selectedAddress;
    purchaseSummary.pincode = this.userDetails.pincode;
    // cart summary
    purchaseSummary.cartSummary = JSON.parse(JSON.stringify(this.cartSummary));
    // order summary
    purchaseSummary.billSummary = {
      "subTotalPrice": this.getSubTotalAmount(),
      "totalPrice": this.getTotalAmount(),
      "tax": this.getTotalTax(),
      "discount": {
        "amount": this.getDiscountAmount(),
        "code": "AC2301"
      }
    }

    purchaseSummary.audit = {
      "gstPercent": 0,
      "cgstPercent": 0,
      "sgstPercent": 0,
      "gstAmount": this.getTotalTax(),
      "gstState": "Karnataka", //TODO read it from pincode. 
      "gstPincode": this.userDetails.pincode
    }

    //************************* */
    return JSON.stringify(purchaseSummary);
  }


  getTotalTax() {
    return this.calculateTotalTax();
  }

  getSubTotalAmount() {
    return this.getTotalAmount() - this.getTotalTax();
  }

  /** 
   *This is the total as per MRP with out discount. 
   */
  getMRPAmount() {
    let total: number = 0;
    this.cartSummary.items.forEach(item => {
      total = total + item.price.amount * item.quantity;
    })
    return total;
  }

  calculateTotalTax() {
    let totalTax: number = 0;

    this.cartSummary.items.forEach(item => {
      totalTax = totalTax + ((item.price.amount * item.quantity)/(1 + (item.tax/100)))
    })
    return this.getMRPAmount() - totalTax;
  }

  // Get Plain Discount Amount

  public getDiscountAmount() {
   return  this.couponApplicationResponse == null ? this.getCartBasedDiscountAmount() : this.getMRPAmount() - this.couponApplicationResponse.cartAmount;
  }

  private getCartBasedDiscountAmount() {
    let subTotalDiscount: number = 0;
    this.cartSummary.items.forEach(item => {
      subTotalDiscount = subTotalDiscount + (item.discount / 100) * item.price.amount * item.quantity;
    })
    subTotalDiscount = subTotalDiscount;
    return subTotalDiscount;
  }

  getCouponDiscount(): number {
    return this.couponApplicationResponse == null
      ? 0
      : this.couponApplicationResponse.discountAmount;
  }

  getTotalAmount() {
    if (this.couponApplicationResponse !== null && this.couponApplicationResponse.success) {
      return this.couponApplicationResponse.cartAmount - this.couponApplicationResponse.discountAmount;
    }
    return (this.getMRPAmount() - this.getDiscountAmount());
  }

  private couponCode: string;
  private couponCodeApplied: boolean = false;

  isCouponApplied() {
    return this.couponApplicationResponse != null ? this.couponApplicationResponse.success : false;
  }

  /**
   * This needs to be working from backend validation & getting the requried discount from backend. 
   * @param couponCode 
   * @returns 
   */
  applyCoupon(couponCode: string) {
    let itemIds: any[] = [];
    this.cartSummary.items.forEach((item: any) => {
      // Add itemId to itemIds array based on the quantity
      for (let i = 0; i < item.quantity; i++) {
        itemIds.push(item.itemId);
      }
    })

    let couponRequest: CouponRequest = {
      'couponCode': couponCode,
      'userId': this.authService.getUserId(),
      'itemIds': itemIds
    };

    this.couponService.applyCoupon(couponRequest);
  }

  resetCouponCodeApplied() {
    this.couponService.resetCouponApplied();
  }



}
