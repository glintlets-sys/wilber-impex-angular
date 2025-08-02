import { Component } from '@angular/core';
import { ShippingProviders, ShippingSettings } from 'src/app/services/configurationInterface/shipping';
import { ConfigurationService } from 'src/app/services/configurationService/configuration.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';
import { ShiprocketService } from 'src/app/services/shiprocket/shiprocket.service';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { UserSelections } from 'src/app/services/configurationInterface/userSelections';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {

  shippingSettings: ShippingSettings = {
    apiUserName: '',
    password: '',
    channelId: '',
    pickupLocation: '',
    authenticationid: '',
    lastAuthenticatedon:  new Date()
  };
  selectedShippingProvider: string;
  shipping_provider: any[] = Object.values(ShippingProviders);
  userSelections: UserSelections;

  constructor(private config_service: ConfigurationService,
    private toaster: ToasterService,
    private ship_rocket_service: ShiprocketService) {
  }

  ngOnInit(): void {
  
    //retrive user settings 
    this.config_service.userSelectionsObservable$.subscribe((val: UserSelections)=>{
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
    this.config_service.getShipmentConfigurationForProvider(this.selectedShippingProvider).subscribe(val=>{
      if(val){
        this.shippingSettings = val;
      }
      
    })
  }  

  changeShippingProvider(shipmentProvidersEvent) {
    this.selectedShippingProvider = shipmentProvidersEvent.target.value
    this.config_service.getShipmentConfigurationForProvider(this.selectedShippingProvider).subscribe(val=>{
      if(val){
        this.shippingSettings = val;
      }
    })
  }

  saveShipping() {

    if (this.selectedShippingProvider == ShippingProviders.ShipRocket) {
      const shipRocketLoginObj = {
        email: this.shippingSettings.apiUserName,
        password: this.shippingSettings.password
      };

      this.ship_rocket_service.loginShipRocket(shipRocketLoginObj).pipe(
        catchError((loginError) => this.handleLoginError(loginError)),
        switchMap((loginResponse) => this.handleSuccessfulLogin(loginResponse))
      ).subscribe();

    }

  }

  private handleLoginError(loginError: any) {
    this.toaster.showToast(loginError.error.message, ToastType.Error, 3000);
    return of(null);
  }

  private handleSuccessfulLogin(loginResponse: any) {

    console.log("login successful for updating. ")
    if (!loginResponse) {
      return of(null);
    }

    if(!this.userSelections) {
      this.userSelections = {
        'primaryPaymentProvider':'',
        'primaryShippingProvder':'',
        'primarySmsProvider':''
      }
    }

    this.userSelections.primaryShippingProvder = this.selectedShippingProvider;
    // updating the user selection of the primary shipping provider. 
    console.log("user selection of provider " + this.userSelections.primaryShippingProvder);
    this.config_service.updateUserSelectionsconfiguration(this.userSelections).subscribe(val => {
      console.log("initializing the updated user selections");
      this.config_service.initializeUserSelections();

      this.shippingSettings = {
        apiUserName: loginResponse.email,
        password: this.shippingSettings.password,
        pickupLocation: this.shippingSettings.pickupLocation,
        channelId: this.shippingSettings.channelId,
        authenticationid: loginResponse.token,
        lastAuthenticatedon: new Date(),
  
      };
      console.log("updating the shipping settings");
      return this.config_service.updateShipmentConfigurationForProvider(this.shippingSettings, this.selectedShippingProvider).pipe(
        tap((val) => {
          this.config_service.initializeShipmentConfigurations();
        }),
        finalize(() => {
        })
      ).subscribe();
    })   
  }


}
