import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentDoneRoutingModule } from './payment-done-routing.module';
import { PaymentDoneComponent } from './payment-done.component';


@NgModule({
  declarations: [
    PaymentDoneComponent
  ],
  imports: [
    CommonModule,
    PaymentDoneRoutingModule
  ]
})
export class PaymentDoneModule { }
