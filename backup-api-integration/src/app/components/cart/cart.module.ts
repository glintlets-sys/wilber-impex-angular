import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from '../cart/cart.component';
import { SharedModule } from '../../shared.module';
import { DeliveryAddressModule } from '../delivery-address/delivery-address.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CartRoutingModule,
    DeliveryAddressModule
  ],
  exports: [
    CartRoutingModule
  ]
})
export class CartModule { }
