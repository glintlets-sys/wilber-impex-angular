import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopCategoriesRoutingModule } from './top-categories-routing.module';
import { TopCategoriesComponent } from './top-categories.component';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';


@NgModule({
  declarations: [
    TopCategoriesComponent
  ],
  imports: [
    CommonModule,
    TopCategoriesRoutingModule,
    CatalogItemModule
  ],
  exports: [
    TopCategoriesComponent
  ]
})
export class TopCategoriesModule { }
