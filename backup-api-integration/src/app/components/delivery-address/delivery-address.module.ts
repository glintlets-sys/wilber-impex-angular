import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { DeliveryAddressComponent } from './delivery-address.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DeliveryAddressComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports: [
    DeliveryAddressComponent
  ]
})
export class DeliveryAddressModule { }
