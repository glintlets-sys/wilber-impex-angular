import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';
import { FormsModule } from '@angular/forms';
import { PlatformComponent } from './platform/platform.component';
import { PaymentComponent } from './payment/payment.component';
import { SmsComponent } from './sms/sms.component';
import { ShippingComponent } from './shipping/shipping.component';

@NgModule({
    declarations: [
        PlatformComponent,
        PaymentComponent,
        SmsComponent,
        ShippingComponent,
    ],
    imports: [
        CommonModule,
        LoadingOverlayModule,
        FormsModule,
    ],
    exports: [
        PlatformComponent,
        PaymentComponent,
        SmsComponent,
        ShippingComponent
    ]
})
export class ConfigurationModule { }
