import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Order_Item, SR_CustomOrderRequest, ShippingProviders, ShippingSettings } from '../configurationInterface/shipping';
import { OrderDTO } from '../order';
import { ConfigurationService } from '../configurationService/configuration.service';
import { UserSelections } from '../configurationInterface/userSelections';

@Injectable({
  providedIn: 'root'
})
export class ShiprocketService {


  private apiUrl = 'https://apiv2.shiprocket.in/v1/external/';
  private apiKeySubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  apiKey$: Observable<string | null> = this.apiKeySubject.asObservable();

  private shipRocketSubject: BehaviorSubject<ShippingSettings | null> = new BehaviorSubject<ShippingSettings | null>(null);
  shipRocketJson$: Observable<ShippingSettings | null | any> = this.shipRocketSubject.asObservable();
  shipping: ShippingSettings;
  userSelections: UserSelections;
  selectedShippingProvider: string;
  shippingSettings: ShippingSettings;

  constructor(private http: HttpClient, private configurationService: ConfigurationService) { 

      this.getShipRocketJsonData();
      //retrive user settings 
      this.configurationService.userSelectionsObservable$.subscribe((val: UserSelections)=>{
        this.userSelections = val;
  
        console.log("inside init of the shippign component. User selections value for primary shipping provier" + JSON.stringify(this.userSelections))
        if((this.userSelections!= null) && (this.userSelections.primaryShippingProvder!="")) {
          console.log("updating the user selection and its details" + this.userSelections.primaryShippingProvder)
          this.selectedShippingProvider = this.userSelections.primaryShippingProvder;
          this.initializeUserSelection();
        }
      })


  }

  initializeUserSelection()
  {
    this.configurationService.getShipmentConfigurationForProvider(this.selectedShippingProvider).subscribe((val:ShippingSettings)=>{
      this.shippingSettings = val;
      this.apiKeySubject.next(this.shippingSettings.authenticationid);
      this.shipRocketSubject.next(this.shippingSettings);
    })
  }  

  sendOrderForShipment(order: OrderDTO): Observable<any> {
    let shippingSummary: any = this.prepareShippingSummary(order);
    return this.createShipment(shippingSummary);    
  }

  prepareShippingSummary(order: OrderDTO) {
    let shippingSummary: SR_CustomOrderRequest = this.updateMandatoryFields(order);
    this.updateOtherFields(shippingSummary, order);
    console.log("Shipping Request so far " + JSON.stringify(shippingSummary));
    return shippingSummary;
  }

  updateMandatoryFields(order: any) {
    let shippingSummary: SR_CustomOrderRequest = this.getNewCustomOrderRequest();
    let purchaseSummary: any = JSON.parse(order.purchaseSummary);
    this.updateOrderDetails(order, shippingSummary);
    this.updatePaymentDetails(purchaseSummary, shippingSummary);
    this.updateSellerAndPickupDetails(shippingSummary);
    this.updateBillingAddressDetails(purchaseSummary, shippingSummary);
    this.updatePackageSizeDetails(shippingSummary);
    return shippingSummary;
  }
 
  updateOrderDetails(order: any, shippingSummary: SR_CustomOrderRequest) {
    shippingSummary.order_id = order.id;
    shippingSummary.order_date = this.formatDate(order.creationDate);

    let orderItems: Order_Item[] = [];
    shippingSummary.order_items = orderItems;

    let purchaseSummary: any = JSON.parse(order.purchaseSummary);
    let cartSummary: any = purchaseSummary.cartSummary;
    let items : any[] = cartSummary.items;

    for(let item of items) {
      let orderItem : Order_Item = {
        name: item.name,
        sku: item.sku?item.sku:"TEMPSKU", //TODO: from the backend. 
        units: item.quantity,
        selling_price: item.price.amount+"",
        discount: item.discount+"",
        tax: item.tax?item.tax:"", //TODO: from the backend 
        hsn: 0
      }
      orderItems.push(orderItem);
    }
  }

  updatePaymentDetails(purchaseSummary: any, shippingSummary: SR_CustomOrderRequest) {
    shippingSummary.payment_method = "Prepaid"; //HARD CODED for NOW. TODO can pick from purchase summary. 
  
    let billSummary: any = purchaseSummary.billSummary;
    shippingSummary.sub_total = billSummary.totalPrice;
    shippingSummary.total_discount = billSummary.discount.amount;
    shippingSummary.shipping_charges = 0; //TODO to handle end to end 
    shippingSummary.giftwrap_charges = 0; //TODO to handle on ui 
    shippingSummary.transaction_charges = 0; //TODO for ONDC
  }

  updateSellerAndPickupDetails(shippingSummary: SR_CustomOrderRequest) {    
    shippingSummary.pickup_location = this.shippingSettings.pickupLocation; // Picked from settings. 
    shippingSummary.channel_id = this.shippingSettings.channelId; //picked from settings
    shippingSummary.reseller_name = "COLOUR CUBS"; //TODO : HARD CODED, to be picked from client profile settings. 
    shippingSummary.company_name = "COLOUR CUBS"; //TODO: to be picked from client profile settings. 
  }

  updateBillingAddressDetails(purchaseSummary: any, shippingSummary: SR_CustomOrderRequest) {
    shippingSummary.billing_customer_name = purchaseSummary.customerName;
    shippingSummary.billing_last_name = ""; //TODO: to be updated in purchase summary. 
    shippingSummary.billing_address = purchaseSummary.address.firstLine;
    shippingSummary.billing_address_2 = purchaseSummary.address.secondLine;
    shippingSummary.billing_city = purchaseSummary.address.city;
    shippingSummary.billing_pincode = purchaseSummary.address.pincode;
    shippingSummary.billing_state = purchaseSummary.address.state;
    shippingSummary.billing_country = purchaseSummary.address.country;
    shippingSummary.billing_email = purchaseSummary.address.emailAddress;
    shippingSummary.billing_phone = purchaseSummary.address.mobileNumber;
    shippingSummary.shipping_is_billing = true;
  }

  updatePackageSizeDetails(shippingSummary: SR_CustomOrderRequest) {
    shippingSummary.length = 10; // TODO: need to capture this as part of cart item summary & in the toy/item object also 
    shippingSummary.breadth = 10; // TODO: need to capture this as part of cart item summary & in the toy/item object also 
    shippingSummary.height = 10; // TODO: need to capture this as part of cart item summary & in the toy/item object also 
    shippingSummary.weight = 2; // TODO: need to capture this as part of cart item summary & in the toy/item object also .
  }

  updateOtherFields(shippingSummary: SR_CustomOrderRequest, order: OrderDTO) {
    shippingSummary.order_type = "NON ESSENTIALS"; // TODO needs to pick this from profile settings
  }
 
  loginShipRocket(loginObj: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "auth/login", loginObj);
  }

  storeShipRocketJson(ShipRocketObj: ShippingSettings) {
    this.shipRocketSubject.next(ShipRocketObj);
  }

  storeApiKey(apiKey: string): void {
    this.apiKeySubject.next(apiKey);
  }

  private generateHeaders(): Observable<HttpHeaders> {
    return this.apiKey$.pipe(
      switchMap(apiKey => {
        if (!apiKey) {
          console.error('Authorization key is missing. Please login first.');
          return new Observable<HttpHeaders>(); // Return an empty observable or handle error accordingly
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        });

        return new Observable<HttpHeaders>(observer => {
          observer.next(headers);
          observer.complete();
        });
      })
    );
  }

  getAllAddress(): Observable<any> {
    return this.generateHeaders().pipe(
      switchMap(headers => this.http.get<any>(this.apiUrl + "settings/company/pickup", { headers }))
    );
  }

  getChannelId(): Observable<any> {
    return this.generateHeaders().pipe(
      switchMap(headers => this.http.get<any>(this.apiUrl + "channels", { headers }))
    );
  }

  getTrackingDataForShippingId(shippingId: string): Observable<any> {
    return this.generateHeaders().pipe(
      switchMap(headers => this.http.get<any>(this.apiUrl + "courier/track/shipment/" + shippingId, { headers }))
    );
  }

  createPickupLocation(pickupLocation: any): Observable<any> {
    return this.generateHeaders().pipe(
      switchMap(headers => this.http.post<any>(this.apiUrl + "settings/company/addpickup", pickupLocation, { headers }))
    );
  }

  createShipment(data: any): Observable<any> {
    return this.generateHeaders().pipe(
      switchMap(headers => this.http.post(`${this.apiUrl}orders/create/adhoc`, data, { headers }))
    );
  }

  getShipRocketJsonData() {
    this.shipRocketJson$.subscribe(val => {
      if (val != null) {
        const lastAuthenticatedDate = new Date(val.lastAuthenticatedon);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate.getTime() - lastAuthenticatedDate.getTime();
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

        if (differenceInDays <= 10) {
          return true
        } else {
          const shipRocketLoginObj = {
            email: val.apiUserName,
            password: val.password
          }
          this.loginShipRocket(shipRocketLoginObj).subscribe(response => {
            this.shipping = {
              apiUserName: response.email,
              password: this.shipping.password,
              pickupLocation: this.shipping.pickupLocation,
              channelId: this.shipping.channelId,
              authenticationid: response.token,
              lastAuthenticatedon: new Date()
            };
            this.configurationService.updateShipmentConfigurationForProvider(this.shipping, ShippingProviders.ShipRocket).subscribe(val=>{
              this.storeShipRocketJson(this.shipping);
              this.storeApiKey(this.shipping.authenticationid);
            })
           
          })
        }
      }
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  
  getNewCustomOrderRequest(): SR_CustomOrderRequest {
    return {
      order_id: '',
      order_date:'', 
      order_items: [{
        name: "",
        sku: "",
        units: 0,
        selling_price: 0+"",
        discount: 0+"",
        tax: 0,
        hsn: 0
      }],
      payment_method: '',
      sub_total: 0,
      pickup_location: '', //TODO from settings
      billing_customer_name: '', 
      billing_city: '',
      billing_pincode: 0,
      billing_state: '',
      billing_country: '',
      billing_email: '',
      billing_phone: 0,
      shipping_is_billing: true,
      length: 0,
      breadth: 0,
      height: 0,
      weight: 0
    };
  }
}
