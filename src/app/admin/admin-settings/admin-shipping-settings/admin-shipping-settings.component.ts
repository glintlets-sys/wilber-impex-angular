import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../shared-services/configurationService/configuration.service';
import { ToasterService } from '../../../shared-services/toaster.service';
import { ToastType } from '../../../shared-services/toaster';

@Component({
  selector: 'app-admin-shipping-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-shipping-settings.component.html',
  styleUrl: './admin-shipping-settings.component.scss'
})
export class AdminShippingSettingsComponent implements OnInit {
  selectedShippingProvider = 'ShipRocket';
  shippingProviders = ['ShipRocket'];
  isLoading = false;

  // ShipRocket Configuration
  shipRocketConfiguration = {
    apiUserName: '',
    password: '',
    channelId: '',
    pickupLocation: '',
    authenticationid: '',
    lastAuthenticatedon: new Date()
  };

  constructor(
    private configurationService: ConfigurationService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    console.log('🚚 [AdminShippingSettings] Component initialized');
    this.loadShippingSettings();
  }

  loadShippingSettings(): void {
    this.isLoading = true;
    console.log('📥 [AdminShippingSettings] Loading shipping settings...');
    
    // Load ShipRocket settings
    const shipRocketSub = this.configurationService.getShipmentConfigurationForProvider('ShipRocket')?.subscribe({
      next: (config) => {
        if (config) {
          this.shipRocketConfiguration = config;
          console.log('✅ [AdminShippingSettings] ShipRocket config loaded:', config);
        }
      },
      error: (error) => {
        console.error('❌ [AdminShippingSettings] Error loading ShipRocket config:', error);
      }
    });

    this.isLoading = false;
  }

  changeSelectedShipping(event: any): void {
    this.selectedShippingProvider = event.target.value;
    console.log('🔄 [AdminShippingSettings] Shipping provider changed to:', this.selectedShippingProvider);
  }

  saveShippingSettings(): void {
    this.isLoading = true;
    console.log('💾 [AdminShippingSettings] Saving shipping settings...');

    let configToSave: any;
    let providerName: string;

    if (this.selectedShippingProvider === 'ShipRocket') {
      configToSave = this.shipRocketConfiguration;
      providerName = 'ShipRocket';
    }

    if (configToSave && providerName) {
      const saveSub = this.configurationService.updateShipmentConfigurationForProvider(configToSave, providerName).subscribe({
        next: (response) => {
          console.log('✅ [AdminShippingSettings] Shipping settings saved:', response);
          this.toasterService.showToast(`${providerName} settings saved successfully!`, ToastType.Success, 3000);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ [AdminShippingSettings] Error saving shipping settings:', error);
          this.toasterService.showToast('Error saving shipping settings', ToastType.Error, 3000);
          this.isLoading = false;
        }
      });
    } else {
      this.toasterService.showToast('Invalid shipping provider configuration', ToastType.Error, 3000);
      this.isLoading = false;
    }
  }

  testShippingConnection(): void {
    console.log('🧪 [AdminShippingSettings] Testing shipping connection for:', this.selectedShippingProvider);
    this.toasterService.showToast('Shipping connection test initiated', ToastType.Info, 3000);
  }

  authenticateShipping(): void {
    console.log('🔐 [AdminShippingSettings] Authenticating shipping provider:', this.selectedShippingProvider);
    this.toasterService.showToast('Authentication process initiated', ToastType.Info, 3000);
  }
}
