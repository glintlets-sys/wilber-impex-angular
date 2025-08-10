import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../shared-services/configurationService/configuration.service';
import { ToasterService } from '../../../shared-services/toaster.service';
import { ToastType } from '../../../shared-services/toaster';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-platform-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-platform-settings.component.html',
  styleUrl: './admin-platform-settings.component.scss'
})
export class AdminPlatformSettingsComponent implements OnInit {
  platform: any = {
    serviceURL: ''
  };
  isLoading = false;

  constructor(
    private configurationService: ConfigurationService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    console.log('🖥️ [AdminPlatformSettings] Component initialized');
    this.loadPlatformSettings();
  }

  loadPlatformSettings(): void {
    this.isLoading = true;
    console.log('📥 [AdminPlatformSettings] Loading platform settings...');
    
    // For now, we'll use a placeholder. In a real implementation, 
    // you would fetch from the configuration service
    this.platform = {
      serviceURL: environment.serviceURL || ''
    };
    
    this.isLoading = false;
  }

  savePlatform(): void {
    this.isLoading = true;
    console.log('💾 [AdminPlatformSettings] Saving platform settings:', this.platform);
    
    // Simulate save operation
    setTimeout(() => {
      this.toasterService.showToast('Platform settings saved successfully!', ToastType.Success, 3000);
      this.isLoading = false;
    }, 1000);
  }
}
