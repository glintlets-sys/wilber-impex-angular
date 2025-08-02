import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    OrderComponent
  ]
})
export class OrderModule { }
