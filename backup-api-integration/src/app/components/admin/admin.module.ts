import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from '../admin/admin.component';
import { SharedModule } from '../../shared.module';
import { AdminOrdersModule } from '../admin-orders/admin-orders.module';
import { StocksModule } from '../stocks/stocks.module';
import { ToyListModule } from '../toy-list/toy-list.module';
import { AwsImageListModule } from '../aws-image-list/aws-image-list.module';
import { StockConsignmentModule } from '../stock-consignment/stock-consignment.module';
import { UserTableModule } from '../user-table/user-table.module';
import { AdminCategoryModule } from '../admin-category/admin-category.module';
import { CouponModule } from './coupon/coupon.module';


@NgModule({
  declarations: [
    AdminComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AdminOrdersModule,
    StocksModule,
    ToyListModule,
    AwsImageListModule,
    StockConsignmentModule,
    UserTableModule,
    AdminCategoryModule,
    CouponModule
  ],
})
export class AdminModule { }
