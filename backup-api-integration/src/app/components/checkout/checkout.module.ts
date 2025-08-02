import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { DeliveryAddressModule } from '../delivery-address/delivery-address.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaymentModule } from 'src/app/components/payment/payment.module';


@NgModule({
  declarations: [
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    DeliveryAddressModule,
    FormsModule,
    RouterModule,
    CheckoutRoutingModule,
    PaymentModule
  ]
})
export class CheckoutModule { }
