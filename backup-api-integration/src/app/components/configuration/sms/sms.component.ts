import { Component } from '@angular/core';
import { Msg91SmsConfiguration, SmsProviders } from 'src/app/services/configurationInterface/sms';
import { UserSelections } from 'src/app/services/configurationInterface/userSelections';
import { ConfigurationService } from 'src/app/services/configurationService/configuration.service';
import { ToastType } from 'src/app/services/toaster';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent {
  msg91SmsConfiguration: Msg91SmsConfiguration = {
    sender: '',
    authKey: '',
    apiUrl: '',
    shortUrl: '',
    number: '',
    templateId: '',
  };
  sms_providers: string[] = Object.values(SmsProviders);
  selectedSmsProvider: string;

  constructor(private config_service: ConfigurationService, 
              private toaster: ToasterService) {

  }

  userSelections: UserSelections;
  ngOnInit(): void {
    
    this.config_service.userSelectionsObservable$.subscribe((val: UserSelections)=>{
      this.userSelections = val;
      console.log("inside init of the shippign component. User selections value for primary shipping provier" + JSON.stringify(this.userSelections))
      if((this.userSelections!= null) && (this.userSelections.primarySmsProvider!="")) {
        console.log("updating the user selection and its details" + this.userSelections.primarySmsProvider)
        this.selectedSmsProvider = this.userSelections.primarySmsProvider;
      }
    })
    this.initializeUserSelection();


  }

  initializeUserSelection()
  {
    console.log("initialzing the provider settings");
    Object.values(SmsProviders).forEach(provider=>{
      console.log("fetching for provider " + provider);
      this.config_service.getSmsConfigurationForProvider(provider).subscribe(val=>{
        if(provider == SmsProviders.MSG91) {
          this.msg91SmsConfiguration = val;
        }
      })
    })
    
  } 


  changeSmsProvider(smsProviderEvent) {
    this.selectedSmsProvider = smsProviderEvent.target.value;
  }


  saveSmsConfiguration() {
    this.userSelections.primarySmsProvider = this.selectedSmsProvider;
    this.config_service.updateUserSelectionsconfiguration(this.userSelections).subscribe((val)=>{
      this.config_service.initializeUserSelections();
      if(this.selectedSmsProvider == SmsProviders.MSG91) 
      {
        this.config_service.updateSMSconfigurationForProvider(this.msg91SmsConfiguration, SmsProviders.MSG91).subscribe((val)=>{
          this.config_service.initializeSMSconfigurations();
          this.toaster.showToast("Update successfull!", ToastType.Success,3000);

        })
      }

    })
  }
}

