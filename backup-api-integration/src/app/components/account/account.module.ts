import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from '../account/account.component';
import { SharedModule } from '../../shared.module';
import { OrdersModule } from '../orders/orders.module';
import { UserTableModule } from '../user-table/user-table.module';
import { StocksModule } from '../stocks/stocks.module';
import { StockConsignmentModule } from '../stock-consignment/stock-consignment.module';
import { AdminOrdersModule } from '../admin-orders/admin-orders.module';
import { AdminCategoryModule } from '../admin-category/admin-category.module';
import { ToyListModule } from '../toy-list/toy-list.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { CouponModule } from '../admin/coupon/coupon.module';
import { RecommendedItemsModule } from '../recommended-items/recommended-items.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { PaymentDoneComponent } from '../payment-done/payment-done.component';
import { BoughtTogetherModule } from '../bought-together/bought-together.module';
import { NotifyMeModule } from '../admin/notify-me/notify-me.module';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    OrdersModule,
    UserTableModule,
    StocksModule,
    StockConsignmentModule,
    AdminOrdersModule,
    AdminCategoryModule,
    ToyListModule,
    AdminUsersModule,
    CouponModule,
    RecommendedItemsModule,
    ConfigurationModule,
    BoughtTogetherModule,
    NotifyMeModule
  ]
})
export class AccountModule { }
