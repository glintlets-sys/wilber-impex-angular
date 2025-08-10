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

    // Updated payload structure for latest PhonePe API v4
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
    console.log('💳 [PhonePePaymentService] makePaymentThroughBackend() - Starting payment for orderId:', orderId);

    const paymentFieldsGeneral: PhonePePaymentFields = this.constructPaymentFields(orderId);
    console.log('📋 [PhonePePaymentService] makePaymentThroughBackend() - Constructed payment fields:', {
      merchantId: paymentFieldsGeneral.merchantId,
      merchantTransactionId: paymentFieldsGeneral.merchantTransactionId,
      amount: paymentFieldsGeneral.amount,
      merchantUserId: paymentFieldsGeneral.merchantUserId,
      mobileNumber: paymentFieldsGeneral.mobileNumber
    });
    
    const path = '/pg/v1/pay';
    const saltKey = environment.phonepeSaltKey;
    const saltIndex = environment.phonepeSaltIndex;
    
    // Encode the payment payload to Base64
    const payloadBase64 = btoa(JSON.stringify(paymentFieldsGeneral));
    
    // Generate checksum for security
    const stringToHash = payloadBase64 + path + saltKey;
    const xVerify = sha256(stringToHash) + '###' + saltIndex;
    
    let paymentFields: PhonePeBackendPaymentFields = {
      orderId: orderId,
      amount: paymentFieldsGeneral.amount,
      payload: JSON.stringify({
        'request': payloadBase64
      }),
      xVerify: xVerify,
      paymentGatewayUrl: environment.phonepePaymentGateway + path,
      saltKey: environment.phonepeSaltKey,
      saltIndex: environment.phonepeSaltIndex
    };
    
    console.log('🔐 [PhonePePaymentService] makePaymentThroughBackend() - Backend payment fields prepared:', {
      orderId: paymentFields.orderId,
      amount: paymentFields.amount,
      paymentGatewayUrl: paymentFields.paymentGatewayUrl,
      xVerifyLength: paymentFields.xVerify?.length || 0,
      merchantTransactionId: paymentFieldsGeneral.merchantTransactionId
    });
    
    console.log('🌐 [PhonePePaymentService] makePaymentThroughBackend() - Calling payment API');

    // Use test payment API if mock mode is enabled
    const paymentObservable = environment.enablePhonePeMockMode 
      ? this.initiateTestPayment(paymentFields) 
      : this.initiatePayment(paymentFields);

    paymentObservable.subscribe({
      next: (response: any) => {
        console.log('📥 [PhonePePaymentService] makePaymentThroughBackend() - Received response:', response);
        
        // Handle mock mode response
        if (environment.enablePhonePeMockMode) {
          console.log('🎭 [PhonePePaymentService] Mock mode - simulating successful payment');
          this.toasterService.showToast('🎭 Mock Payment: Processing test payment...', ToastType.Info, 2000);
          
          // Simulate redirect to payment response page with mock success
          setTimeout(() => {
            const mockTransactionId = paymentFieldsGeneral.merchantTransactionId;
            const redirectUrl = `${window.location.origin}/payment-response?merchantTransactionId=${mockTransactionId}&orderId=${orderId}&mock=true&status=PAYMENT_SUCCESS`;
            console.log('🎭 [PhonePePaymentService] Mock mode - redirecting to:', redirectUrl);
            window.location.href = redirectUrl;
          }, 1500);
          return;
        }
        
        // Handle real PhonePe response structures
        if (response && response.redirectUrl) {
          console.log('🚀 [PhonePePaymentService] makePaymentThroughBackend() - Redirecting to:', response.redirectUrl);
          window.location.href = response.redirectUrl;
        } else if (response && response.data && response.data.instrumentResponse && response.data.instrumentResponse.redirectInfo) {
          const redirectUrl = response.data.instrumentResponse.redirectInfo.url;
          console.log('🚀 [PhonePePaymentService] makePaymentThroughBackend() - Redirecting to (nested):', redirectUrl);
          window.location.href = redirectUrl;
        } else {
          console.error('❌ [PhonePePaymentService] makePaymentThroughBackend() - No redirectUrl in response:', response);
          this.toasterService.showToast('Payment initiation failed. Please try again!', ToastType.Error, 3000);
        }
      },
      error: (error) => {
        console.error('❌ [PhonePePaymentService] makePaymentThroughBackend() - Error during payment initiation:', error);
        let errorMessage = 'Unable to reach payment server. Please try again!';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.toasterService.showToast(errorMessage, ToastType.Error, 5000);
      }
    });
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

  // Method to verify payment status using PhonePe's status API
  public verifyPaymentStatus(merchantTransactionId: string): Observable<any> {
    if (!this.isSiteEnabled) {
      this.toasterService.showToast("Sorry! We are currently under maintenance. Please try after sometime.", ToastType.Error, 5000);
      return of(false);
    }

    const url = `${environment.serviceURL}api/phonepe/status/${merchantTransactionId}`;
    return this.http.get(url);
  }

  // Method to check payment status and handle the response
  public checkPaymentStatus(merchantTransactionId: string): void {
    console.log('🔍 [PhonePePaymentService] checkPaymentStatus() - Checking status for:', merchantTransactionId);

    this.verifyPaymentStatus(merchantTransactionId).subscribe({
      next: (response: any) => {
        console.log('📥 [PhonePePaymentService] checkPaymentStatus() - Received status response:', response);
        
        if (response && response.success) {
          if (response.data && response.data.state === 'COMPLETED') {
            this.toasterService.showToast('Payment completed successfully!', ToastType.Success, 5000);
          } else if (response.data && response.data.state === 'FAILED') {
            this.toasterService.showToast('Payment failed. Please try again.', ToastType.Error, 5000);
          } else {
            this.toasterService.showToast('Payment is still being processed.', ToastType.Warn, 5000);
          }
        } else {
          this.toasterService.showToast('Unable to verify payment status.', ToastType.Error, 3000);
        }
      },
      error: (error) => {
        console.error('❌ [PhonePePaymentService] checkPaymentStatus() - Error checking status:', error);
        this.toasterService.showToast('Error checking payment status.', ToastType.Error, 3000);
      }
    });
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

  /**
   * Calls the backend initiateTestPayment API for mock payments
   */
  private initiateTestPayment(paymentFields: any): Observable<any> {
    const url = `${environment.serviceURL}api/phonepe/initiateTestPayment`;
    
    console.log('🎭 [PhonePePaymentService] initiateTestPayment() - Calling:', url);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(url, paymentFields, { headers });
  }

}



