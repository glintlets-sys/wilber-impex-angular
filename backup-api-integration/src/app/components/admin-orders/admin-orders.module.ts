import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { AdminOrdersComponent } from './admin-orders.component';
import { DispatchDetailsModule } from '../dispatch-details/dispatch-details.module';



@NgModule({
  declarations: [
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DispatchDetailsModule
  ], 
  exports: [
    AdminOrdersComponent
  ]
})
export class AdminOrdersModule { }
