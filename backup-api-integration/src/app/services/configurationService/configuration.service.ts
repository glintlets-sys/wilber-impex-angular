import { Injectable } from '@angular/core';
import { PaymentProviders } from '../configurationInterface/payment';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SmsProviders } from '../configurationInterface/sms';
import { HttpClient } from '@angular/common/http';
import { ShippingProviders, ShippingSettings } from '../configurationInterface/shipping';
import { AuthenticationService } from '../authentication.service';
import { UserSelections } from '../configurationInterface/userSelections';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  /**
   * This is the single service place to fetch the tenant specific configurations for all external operations 
   * from this website. 
   */

  private apiUrl = environment.serviceURL + 'tenant-settings/';
  private userSelections: string = "USER_SELECTIONS";

  constructor(private http: HttpClient, private authService: AuthenticationService) { 
    this.authService.isUserLoggedIn.subscribe((val)=>{
      if(val){
        this.initializeConfigurations();
      }
    })
  }

  initializeConfigurations() {
    console.log("calling the initializers for configurations");
      this.initializeUserSelections();
      this.initializeSMSconfigurations();
      this.initializePaymentConfigurations();
      this.initializeShipmentConfigurations();
  }

  private userSelectionsSubject = new BehaviorSubject<any>(null);
  public userSelectionsObservable$ = this.userSelectionsSubject.asObservable();
  initializeUserSelections() {
    this.fetchUserSelections().subscribe((response: any) => {
      console.log("user selections : " + JSON.stringify(response));
      this.userSelectionsSubject.next(JSON.parse(response.value));
    })
  }
  
  fetchUserSelections() {
    return this.http.get<any>(this.apiUrl + this.userSelections);
  }

  public updateUserSelectionsconfiguration(userSelections: UserSelections): Observable<any> {
    return this.http.post<any>(this.apiUrl + this.userSelections, userSelections);
  }

  private shipmentConfigurations = new Map<string, BehaviorSubject<any>>();

  public initializeShipmentConfigurations() {
    // run through each of the providers in the enum and fetch the settings. 
    // if the settings exist then store them in the behavior subject in a map. 

    Object.values(ShippingProviders).forEach((providerName:string)=>{
      this.fetchShipmentConfigurationForProvider(providerName).subscribe((response: any)=>{
        let providerConfiguration =  JSON.parse(response.value);
        if (!this.shipmentConfigurations.has(providerName)) {
          // If the provider doesn't have a BehaviorSubject yet, create it
          console.log("shiping settings for provider " + providerName + " : "  + JSON.stringify(providerConfiguration) )
          this.shipmentConfigurations.set(providerName, new BehaviorSubject<any>(providerConfiguration));
        } else {
          // If it exists, just push the new config
          const providerSubject = this.shipmentConfigurations.get(providerName);
          providerSubject?.next(providerConfiguration);
        } 
      })
    })
  }

  public getShipmentConfigurationForProvider(providerName: string): BehaviorSubject<any> | undefined {
    // This method returns a BehaviorSubject for the given provider
    // Components can subscribe to this BehaviorSubject to receive updates
    if (!this.shipmentConfigurations.has(providerName)) {
      // If the provider doesn't have a BehaviorSubject yet, create it
      let shippingSettings: ShippingSettings = {
        apiUserName: '',
        password: '',
        channelId: '',
        pickupLocation: '',
        authenticationid: '',
        lastAuthenticatedon:  new Date()
      };
      this.shipmentConfigurations.set(providerName, new BehaviorSubject<any>(shippingSettings));
    } 
    return this.shipmentConfigurations.get(providerName);
  }


  private paymentConfigurations = new Map<string, BehaviorSubject<any>>();
  public initializePaymentConfigurations() {
    
    // run through each of the providers in the enum and fetch the settings. 
    // if the settings exist then store them in the behavior subject in a map. 
    Object.values(PaymentProviders).forEach((providerName:string)=>{
      
      this.fetchPaymentConfigurationForProvider(providerName).subscribe((response: any)=>{
        let providerConfiguration =  JSON.parse(response.value);
        if (!this.paymentConfigurations.has(providerName)) {
          // If the provider doesn't have a BehaviorSubject yet, create it
          this.paymentConfigurations.set(providerName, new BehaviorSubject<any>(providerConfiguration));
        } else {
          // If it exists, just push the new config
          const providerSubject = this.paymentConfigurations.get(providerName);
          providerSubject?.next(providerConfiguration);
        } 
      })
    })


  }

  public getPaymentConfigurationForProvider(providerName: string): BehaviorSubject<any> | undefined {
    // This method returns a BehaviorSubject for the given provider
    // Components can subscribe to this BehaviorSubject to receive updates

    if (!this.paymentConfigurations.has(providerName)) {
      // If the provider doesn't have a BehaviorSubject yet, create it
      let configuration = {};
      if(providerName == PaymentProviders.CCAvenueSettings) {
        configuration = { merchant_id: '', access_code: '', working_key: '', redirect_url: '', cancel_url: '' }
      } else if(providerName == PaymentProviders.PhonePeSettings) {
        configuration = {
          phonePeMerchantId: '',
          phonePeRedirectUrl: '',
          phonePeRedirectMode: '',
          phonePeCallbackUrl: '',
          phonePePaymentInstrumentType: '',
          phonepeSaltKey: '',
          phonepeSaltIndex: '',
          phonepePaymentGateway: '',
        };
      }
      this.paymentConfigurations.set(providerName, new BehaviorSubject<any>(configuration));
    } 

    return this.paymentConfigurations.get(providerName);
  }


  private smsConfigurations = new Map<string, BehaviorSubject<any>>();
  public initializeSMSconfigurations() {    

    // run through each of the providers in the enum and fetch the settings. 
    // if the settings exist then store them in the behavior subject in a map. 
    Object.values(SmsProviders).forEach((providerName:string)=>{
      this.fetchSMSConfigurationForProvider(providerName).subscribe((response: any)=>{
        let providerConfiguration = JSON.parse(response.value);
        if (!this.smsConfigurations.has(providerName)) {
          // If the provider doesn't have a BehaviorSubject yet, create it
          this.smsConfigurations.set(providerName, new BehaviorSubject<any>(providerConfiguration));
        } else {
          // If it exists, just push the new config
          const providerSubject = this.smsConfigurations.get(providerName);
          providerSubject?.next(providerConfiguration);
        } 
      })
    })
  }
  public getSmsConfigurationForProvider(providerName: string): BehaviorSubject<any> | undefined {
    // This method returns a BehaviorSubject for the given provider
    // Components can subscribe to this BehaviorSubject to receive updates

    if (!this.smsConfigurations.has(providerName)) {
      // If the provider doesn't have a BehaviorSubject yet, create it
      let configuration = {};
      if(providerName == SmsProviders.MSG91) {
        configuration = {
          sender: '',
          authKey: '',
          apiUrl: '',
          shortUrl: '',
          number: '',
          templateId: '',
        };
      } 
      this.smsConfigurations.set(providerName, new BehaviorSubject<any>(configuration));
      }

    return this.smsConfigurations.get(providerName);
  }


  private takePayments: string = "TakePayments";

  // Fetch the payment toggle state (returns a boolean)
  public fetchIsSitePaymentEnabled(): Observable<boolean> {
    return this.http.get<any>(this.apiUrl + this.takePayments)
      .pipe(
        map(response => {
          // Assuming response has a property 'isToggled' indicating the toggle state
          return JSON.parse(response?.value).isToggled === true; // Ensure it returns a boolean
        })
      );
  }

  // Update the payment toggle state and return a boolean
  public updateIsSitePaymentEnabled(isToggled: boolean): Observable<boolean> {
    console.log("updating toggle to " + isToggled);
    return this.http.post<any>(this.apiUrl + this.takePayments, { "isToggled" : isToggled })
      .pipe(
        map(response => {
          // Assuming the API response contains success information or 'isToggled'
          return JSON.parse(response?.value).isToggled === true; // Ensure it returns a boolean
        })
      );
  }
  private fetchSMSConfigurationForProvider(sms_provider: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + sms_provider);
  }

  public updateSMSconfigurationForProvider(smsSetting: any, sms_provider: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + sms_provider, smsSetting);
  }

  private fetchPaymentConfigurationForProvider(paymentProvider: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + paymentProvider);
  }

  public updatePaymentConfiguration(payment_configuration: any, payment_provider: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + payment_provider, payment_configuration);
  }

  private fetchShipmentConfigurationForProvider(shipmentProvider: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + shipmentProvider);
  }

  public updateShipmentConfigurationForProvider(shipmentConfiguration: any, shipmentProvider: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + shipmentProvider, shipmentConfiguration);
  }

}
