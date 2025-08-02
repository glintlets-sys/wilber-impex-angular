import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentPolicyRoutingModule } from './shipment-policy-routing.module';
import { ShipmentPolicyComponent } from './shipment-policy.component';


@NgModule({
  declarations: [
    ShipmentPolicyComponent
  ],
  imports: [
    CommonModule,
    ShipmentPolicyRoutingModule
  ]
})
export class ShipmentPolicyModule { }
