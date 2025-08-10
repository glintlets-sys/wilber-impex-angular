import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPlatformSettingsComponent } from './admin-platform-settings/admin-platform-settings.component';
import { AdminPaymentSettingsComponent } from './admin-payment-settings/admin-payment-settings.component';
import { AdminShippingSettingsComponent } from './admin-shipping-settings/admin-shipping-settings.component';
import { AdminSmsSettingsComponent } from './admin-sms-settings/admin-sms-settings.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AdminPlatformSettingsComponent,
    AdminPaymentSettingsComponent,
    AdminShippingSettingsComponent,
    AdminSmsSettingsComponent
  ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit {
  activeSettingsView = 'platform';

  constructor() { }

  ngOnInit(): void {
    console.log('⚙️ [AdminSettings] Settings component initialized');
  }

  setActiveView(view: string): void {
    this.activeSettingsView = view;
    console.log('🔄 [AdminSettings] Switching to view:', view);
  }
}
