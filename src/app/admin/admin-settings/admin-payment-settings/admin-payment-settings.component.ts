import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../shared-services/configurationService/configuration.service';
import { ToasterService } from '../../../shared-services/toaster.service';
import { ToastType } from '../../../shared-services/toaster';

@Component({
  selector: 'app-admin-payment-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-payment-settings.component.html',
  styleUrl: './admin-payment-settings.component.scss'
})
export class AdminPaymentSettingsComponent implements OnInit {
  selectedPaymentProvider = 'CCAvenueSettings';
  payment_Types = ['CCAvenueSettings', 'PhonePeSettings'];
  isLoading = false;

  // CCAvenue Configuration
  ccAvenueConfiguration = {
    merchant_id: '',
    access_code: '',
    working_key: '',
    redirect_url: ''
  };

  // PhonePe Configuration
  phonePeConfiguration = {
    merchant_id: '',
    salt_key: '',
    salt_index: '',
    redirect_url: ''
  };

  constructor(
    private configurationService: ConfigurationService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    console.log('💳 [AdminPaymentSettings] Component initialized');
    this.loadPaymentSettings();
  }

  loadPaymentSettings(): void {
    this.isLoading = true;
    console.log('📥 [AdminPaymentSettings] Loading payment settings...');
    
    // Load CCAvenue settings
    const ccAvenueSub = this.configurationService.getPaymentConfigurationForProvider('CCAvenueSettings')?.subscribe({
      next: (config) => {
        if (config) {
          this.ccAvenueConfiguration = config;
          console.log('✅ [AdminPaymentSettings] CCAvenue config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminPaymentSettings] Error loading CCAvenue config:', error);
      }
    });

    // Load PhonePe settings
    const phonePeSub = this.configurationService.getPaymentConfigurationForProvider('PhonePeSettings')?.subscribe({
      next: (config) => {
        if (config) {
          this.phonePeConfiguration = config;
          console.log('✅ [AdminPaymentSettings] PhonePe config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminPaymentSettings] Error loading PhonePe config:', error);
      }
    });

    this.isLoading = false;
  }

  changeSelectedPayment(event: any): void {
    this.selectedPaymentProvider = event.target.value;
    console.log('🔄 [AdminPaymentSettings] Payment provider changed to:', this.selectedPaymentProvider);
  }

  savePaymentSettings(): void {
    this.isLoading = true;
    console.log('💾 [AdminPaymentSettings] Saving payment settings...');

    let configToSave: any;
    let providerName: string;

    if (this.selectedPaymentProvider === 'CCAvenueSettings') {
      configToSave = this.ccAvenueConfiguration;
      providerName = 'CCAvenueSettings';
    } else if (this.selectedPaymentProvider === 'PhonePeSettings') {
      configToSave = this.phonePeConfiguration;
      providerName = 'PhonePeSettings';
    }

    if (configToSave && providerName) {
      const saveSub = this.configurationService.updatePaymentConfiguration(configToSave, providerName).subscribe({
        next: (response) => {
          console.log('✅ [AdminPaymentSettings] Payment settings saved:', response);
          this.toasterService.showToast(`${providerName} settings saved successfully!`, ToastType.Success, 3000);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ [AdminPaymentSettings] Error saving payment settings:', error);
          this.toasterService.showToast('Error saving payment settings', ToastType.Error, 3000);
          this.isLoading = false;
        }
      });
    } else {
      this.toasterService.showToast('Invalid payment provider configuration', ToastType.Error, 3000);
      this.isLoading = false;
    }
  }

  testPaymentConnection(): void {
    console.log('🧪 [AdminPaymentSettings] Testing payment connection for:', this.selectedPaymentProvider);
    this.toasterService.showToast('Payment connection test initiated', ToastType.Info, 3000);
  }
}
