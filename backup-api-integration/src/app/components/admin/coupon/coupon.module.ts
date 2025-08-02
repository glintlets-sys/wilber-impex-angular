import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponComponent } from './coupon.component';
import { AddEditCouponComponent } from './add-edit-coupon/add-edit-coupon.component';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
    declarations: [
        CouponComponent,
        AddEditCouponComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxPaginationModule
    ],
    exports: [
        CouponComponent
    ]
})
export class CouponModule { }
