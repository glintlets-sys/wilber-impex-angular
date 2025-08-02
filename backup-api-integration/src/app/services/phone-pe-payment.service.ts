import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { sha256 } from 'js-sha256';
import { PhonePePaymentFields, PaymentFields, PhonePeBackendPaymentFields } from './payment-fields';
import { PaymentService } from './payment.service';
import { ConfigService } from './config.service';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
import { btoa } from 'abab';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import { ConfigurationService } from './configurationService/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class PhonePePaymentService {

  isSiteEnabled: boolean = false;

  constructor(private http: HttpClient, 
    private paymentService: PaymentService,
    private configService: ConfigService,
    private toasterService: ToasterService, 
    private authService: AuthenticationService, 
    private configurationSettings: ConfigurationService) {

      this.configurationSettings.fetchIsSitePaymentEnabled().subscribe(val=>{
        this.isSiteEnabled = val;
      });
     }
  
  private constructPaymentFields(orderId: string): PhonePePaymentFields {
    const paymentFields: PaymentFields = this.paymentService.createPaymentFields(orderId);

// Append the formatted timestamp to the merchantTransactionId
  const merchantTransactionId = orderId + "_" + this.configService.getTenantDetails()+"_"+this.authService.getUserId();
  let amountInRupees = parseFloat(paymentFields.amount); // Parse to a number
  let roundedAmountInRupees = Math.round(amountInRupees); // Round to nearest rupee
  let amountInPaise = roundedAmountInRupees * 100;

    let phonepePaymentFields : PhonePePaymentFields = {
      merchantId: environment.phonePeMerchantId,

      merchantTransactionId: merchantTransactionId,
      
      amount: amountInPaise, // should be passed in paise not in rupees.
      merchantUserId: this.configService.getTenantDetails()+"_"+this.authService.getUserId() + "_" + this.authService.getUsername(),
      redirectUrl: environment.phonePeRedirectUrl,
      redirectMode: environment.phonePeRedirectMode,
      callbackUrl: environment.phonePeCallbackUrl,
      paymentInstrument: {
        type:environment.phonePePaymentInstrumentType,
        order_id:orderId,
        tenant_id:this.configService.getTenantDetails()
      },
      mobileNumber:paymentFields.deliveryTel
    };


    return phonepePaymentFields;
  }

  
  public initiatePayment(paymentFields: PhonePeBackendPaymentFields): Observable<any> {
    if(!this.isSiteEnabled) {
      this.toasterService.showToast("Sorry! We are currently under maintenance. Please try after sometime. ", ToastType.Error, 5000);
      return of(false);
    }
    const url = `${environment.serviceURL}api/phonepe/initiate`; // Adjust the URL as per your environment
    return this.http.post(url, paymentFields);
  }

  public makePaymentThroughBackend(orderId: string): void {

    

    const paymentFieldsGeneral: PhonePePaymentFields = this.constructPaymentFields(orderId);
    const path = '/pg/v1/pay';
    const saltKey = environment.phonepeSaltKey;
    const saltIndex = environment.phonepeSaltIndex;
    let paymentFields: PhonePeBackendPaymentFields ={
      orderId: orderId,
      amount: paymentFieldsGeneral.amount,
      payload: JSON.stringify({
        'request': btoa(JSON.stringify(paymentFieldsGeneral))
      }),
      xVerify: sha256(btoa(JSON.stringify(paymentFieldsGeneral)) + path + saltKey) + '###' + saltIndex,
      paymentGatewayUrl: environment.phonepePaymentGateway + path,
      saltKey: environment.phonepeSaltKey,
      saltIndex: environment.phonepeSaltIndex
    };
    this.initiatePayment(paymentFields).subscribe(
      (response: any) => {
        if (response && response.redirectUrl) {
          window.location.href = response.redirectUrl; // Redirect to the URL
        } else {
          this.toasterService.showToast('Something went wrong while redirecting to payment gateway. Please retry!',ToastType.Error, 3000 );
        }
      },
      (error) => {
        this.toasterService.showToast('Something went wrong. Unable to reach payment server!',ToastType.Error, 3000);
      }
    );
  }

  private sendPhonePePaymentRequest(paymentFields: PhonePePaymentFields) {
    const paymentgateway = environment.phonepePaymentGateway;
    const path = '/pg/v1/pay';
    const payload = JSON.stringify(paymentFields);
    const saltKey = environment.phonepeSaltKey;
    const saltIndex = environment.phonepeSaltIndex;
    const xVerify = sha256(btoa(payload) + path + saltKey) + '###' + saltIndex;
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'accept': 'application/json'
    });

    const request = {
      'request': btoa(payload)
    }

    console.log("Service URL: " + paymentgateway + path);
    console.log("payload: " + JSON.stringify(request) );
    console.log("headers: "+ JSON.stringify({
      'Content-Type': 'application/json',
      'X-VERIFY': xVerify,
      'accept': 'application/json'
    }));
    console.log("xVerify: " + xVerify);
    console.log("payload before base64: " + payload);
    console.log("salt key: " + saltKey);
    console.log("salt index: " + saltIndex);
    console.log("path: " + path)

    return this.http.post(paymentgateway + path, JSON.stringify(request), { headers });
  }

  // Handling payment gateway initialization from front end. 
  // As of now not being used. Keeping code, incase required in future. 

  public makePayment(orderId: string) {
    const paymentFields: PhonePePaymentFields = this.constructPaymentFields(orderId);

    this.sendPhonePePaymentRequest(paymentFields).subscribe((response: any) => {
        if (response && response.data && response.data.instrumentResponse 
            && response.data.instrumentResponse.redirectInfo 
            && response.data.instrumentResponse.redirectInfo.url) {
            // Redirect to the URL provided in the response
            window.location.href = response.data.instrumentResponse.redirectInfo.url;
        } else {
            // Handle error scenario
            this.toasterService.showToast("Something went wrong while redirecting to payment gateway. Please retry!", ToastType.Error, 3000);
        }
    }, error => {
        this.toasterService.showToast("Something went wrong. Unable to reach payment server!", ToastType.Error, 3000);
    });
}


 
  
}



