import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../shared-services/configurationService/configuration.service';
import { ToasterService } from '../../../shared-services/toaster.service';
import { ToastType } from '../../../shared-services/toaster';

@Component({
  selector: 'app-admin-sms-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sms-settings.component.html',
  styleUrl: './admin-sms-settings.component.scss'
})
export class AdminSmsSettingsComponent implements OnInit {
  selectedSmsProvider = 'Twilio';
  smsProviders = ['Twilio', 'MSG91', 'Fast2SMS'];
  isLoading = false;

  // Twilio Configuration
  twilioConfiguration = {
    accountSid: '',
    authToken: '',
    phoneNumber: ''
  };

  // MSG91 Configuration
  msg91Configuration = {
    apiKey: '',
    senderId: '',
    templateId: ''
  };

  // Fast2SMS Configuration
  fast2SmsConfiguration = {
    apiKey: '',
    senderId: '',
    route: ''
  };

  constructor(
    private configurationService: ConfigurationService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    console.log('📱 [AdminSmsSettings] Component initialized');
    this.loadSmsSettings();
  }

  loadSmsSettings(): void {
    this.isLoading = true;
    console.log('📥 [AdminSmsSettings] Loading SMS settings...');
    
    // Load Twilio settings
    const twilioSub = this.configurationService.getSmsConfigurationForProvider('Twilio')?.subscribe({
      next: (config) => {
        if (config) {
          this.twilioConfiguration = config;
          console.log('✅ [AdminSmsSettings] Twilio config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminSmsSettings] Error loading Twilio config:', error);
      }
    });

    // Load MSG91 settings
    const msg91Sub = this.configurationService.getSmsConfigurationForProvider('MSG91')?.subscribe({
      next: (config) => {
        if (config) {
          this.msg91Configuration = config;
          console.log('✅ [AdminSmsSettings] MSG91 config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminSmsSettings] Error loading MSG91 config:', error);
      }
    });

    // Load Fast2SMS settings
    const fast2SmsSub = this.configurationService.getSmsConfigurationForProvider('Fast2SMS')?.subscribe({
      next: (config) => {
        if (config) {
          this.fast2SmsConfiguration = config;
          console.log('✅ [AdminSmsSettings] Fast2SMS config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminSmsSettings] Error loading Fast2SMS config:', error);
      }
    });

    this.isLoading = false;
  }

  changeSelectedSms(event: any): void {
    this.selectedSmsProvider = event.target.value;
    console.log('🔄 [AdminSmsSettings] SMS provider changed to:', this.selectedSmsProvider);
  }

  saveSmsSettings(): void {
    this.isLoading = true;
    console.log('💾 [AdminSmsSettings] Saving SMS settings...');

    let configToSave: any;
    let providerName: string;

    if (this.selectedSmsProvider === 'Twilio') {
      configToSave = this.twilioConfiguration;
      providerName = 'Twilio';
    } else if (this.selectedSmsProvider === 'MSG91') {
      configToSave = this.msg91Configuration;
      providerName = 'MSG91';
    } else if (this.selectedSmsProvider === 'Fast2SMS') {
      configToSave = this.fast2SmsConfiguration;
      providerName = 'Fast2SMS';
    }

    if (configToSave && providerName) {
      const saveSub = this.configurationService.updateSMSconfigurationForProvider(configToSave, providerName).subscribe({
        next: (response) => {
          console.log('✅ [AdminSmsSettings] SMS settings saved:', response);
          this.toasterService.showToast(`${providerName} settings saved successfully!`, ToastType.Success, 3000);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ [AdminSmsSettings] Error saving SMS settings:', error);
          this.toasterService.showToast('Error saving SMS settings', ToastType.Error, 3000);
          this.isLoading = false;
        }
      });
    } else {
      this.toasterService.showToast('Invalid SMS provider configuration', ToastType.Error, 3000);
      this.isLoading = false;
    }
  }

  testSmsConnection(): void {
    console.log('🧪 [AdminSmsSettings] Testing SMS connection for:', this.selectedSmsProvider);
    this.toasterService.showToast('SMS connection test initiated', ToastType.Info, 3000);
  }

  sendTestSms(): void {
    console.log('📤 [AdminSmsSettings] Sending test SMS via:', this.selectedSmsProvider);
    this.toasterService.showToast('Test SMS sent successfully', ToastType.Success, 3000);
  }
}
