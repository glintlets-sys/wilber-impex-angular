import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RelatedProductsComponent } from './related-products.component';
@NgModule({
    declarations: [
        RelatedProductsComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
    ],
    exports: [
        RelatedProductsComponent
    ]
})
export class RelatedProductsModule { }
