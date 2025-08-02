import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseResponseRoutingModule } from './purchase-response-routing.module';
import { PurchaseResponseComponent } from '../purchase-response/purchase-response.component';
import { SharedModule } from '../../shared.module';



@NgModule({
  declarations: [
    PurchaseResponseComponent
  ],
  imports: [
    CommonModule,
    PurchaseResponseRoutingModule,
    SharedModule
  ]
})
export class PurchaseResponseModule { }
