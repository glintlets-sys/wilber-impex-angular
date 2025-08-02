import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PaymentDoneModule } from '../payment-done/payment-done.module';


@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    PaymentDoneModule,
  ],
  exports: [
    PaymentComponent
  ]
})
export class PaymentModule { }
