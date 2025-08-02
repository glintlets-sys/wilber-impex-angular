import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { SimilarProductsComponent } from './similar-products.component';
import { CatalogItemModule } from 'src/app/components/catalog-item/catalog-item.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SimilarProductsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CatalogItemModule
  ],
  exports: [
    SimilarProductsComponent
  ]
})
export class SimilarProductsModule { }
