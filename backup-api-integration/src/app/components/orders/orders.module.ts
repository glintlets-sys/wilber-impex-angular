import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from '../orders/orders.component';
import { SharedModule } from '../../shared.module';
import { PaymentDoneModule } from '../payment-done/payment-done.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductReviewModule } from 'src/app/shared/product-review/product-review.module';


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule,
    PaymentDoneModule,
    NgxPaginationModule,
    ProductReviewModule
  ],
  exports: [
    OrdersComponent
  ]
})
export class OrdersModule { }
