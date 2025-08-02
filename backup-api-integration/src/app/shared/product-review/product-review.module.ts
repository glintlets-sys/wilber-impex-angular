import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductReviewRoutingModule } from './product-review-routing.module';
import { ProductReviewComponent } from './product-review.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ProductReviewComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        ProductReviewRoutingModule
    ],
    exports: [
        ProductReviewComponent
    ]
})
export class ProductReviewModule { }
