import { Component, OnInit } from '@angular/core';
import { CCAvenueSettings, PaymentProviders, PhonePeSettings } from 'src/app/services/configurationInterface/payment';
import { UserSelections } from 'src/app/services/configurationInterface/userSelections';
import { ConfigurationService } from 'src/app/services/configurationService/configuration.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  selectedPaymentProvider: string = "";
  payment_Types: string[] = Object.values(PaymentProviders);

  public ccAvenueConfiguration: CCAvenueSettings = { merchant_id: '', access_code: '', working_key: '', redirect_url: '', cancel_url: '' };
  
  public phonePeConfiguration: PhonePeSettings = {
    phonePeMerchantId: '',
    phonePeRedirectUrl: '',
    phonePeRedirectMode: '',
    phonePeCallbackUrl: '',
    phonePePaymentInstrumentType: '', 
    phonepeSaltKey: '',
    phonepeSaltIndex: '',
    phonepePaymentGateway: '',
  };

  constructor(private config_service: ConfigurationService, 
    private toaster: ToasterService) {

  }
  userSelections: UserSelections;
  ngOnInit(): void {
    this.config_service.userSelectionsObservable$.subscribe((val: UserSelections)=>{
      this.userSelections = val;
      console.log("inside init of the shippign component. User selections value for primary shipping provier" + JSON.stringify(this.userSelections))
      if((this.userSelections!= null) && (this.userSelections.primaryPaymentProvider!="")) {
        console.log("updating the user selection and its details" + this.userSelections.primaryPaymentProvider)
        this.selectedPaymentProvider = this.userSelections.primaryPaymentProvider;
      }
    })
    this.initializeUserSelection();
  }


  initializeUserSelection()
  {
    console.log("initialzing the provider settings");
    Object.values(PaymentProviders).forEach(provider=>{
      console.log("fetching for provider " + provider);
      this.config_service.getPaymentConfigurationForProvider(provider).subscribe(val=>{
        if(provider == PaymentProviders.CCAvenueSettings) {
          this.ccAvenueConfiguration = val;
        } else if (provider == PaymentProviders.PhonePeSettings ) {
          this.phonePeConfiguration = val;
        }
        
      })
    })
    
  } 
  changeSelectedPayment(payment) {
    this.selectedPaymentProvider = payment.target.value
    this.initializeUserSelection();
  }

  savePaymentConfiguration() {
    this.userSelections.primaryPaymentProvider = this.selectedPaymentProvider;
    this.config_service.updateUserSelectionsconfiguration(this.userSelections).subscribe((val)=>{
      this.config_service.initializeUserSelections();
      if(this.selectedPaymentProvider == PaymentProviders.CCAvenueSettings) 
      {
        this.config_service.updatePaymentConfiguration(this.ccAvenueConfiguration, PaymentProviders.CCAvenueSettings).subscribe((val)=>{
          this.config_service.initializePaymentConfigurations();
          this.toaster.showToast("Update successfull!", ToastType.Success,3000);

        })
      } else if ( this.selectedPaymentProvider == PaymentProviders.PhonePeSettings) {
        this.config_service.updatePaymentConfiguration(this.phonePeConfiguration, PaymentProviders.PhonePeSettings).subscribe(val=>{
          this.config_service.initializePaymentConfigurations();
          this.toaster.showToast("Update successfull!", ToastType.Success,3000);
        })
      }

    })
  }
}
