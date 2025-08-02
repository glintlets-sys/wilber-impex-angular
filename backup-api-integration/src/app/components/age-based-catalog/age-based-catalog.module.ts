import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgeBasedCatalogRoutingModule } from './age-based-catalog-routing.module';
import { AgeBasedCatalogComponent } from './age-based-catalog.component';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';
import { FilterModule } from '../filter/filter.module';
import { BreadCrumbModule } from '../bread-crumb/bread-crumb.module';


@NgModule({
  declarations: [
    AgeBasedCatalogComponent
  ],
  imports: [
    CommonModule,
    AgeBasedCatalogRoutingModule,
    CatalogItemModule,
    FilterModule,
    BreadCrumbModule
  ],
  exports: [
    AgeBasedCatalogComponent
  ]
})
export class AgeBasedCatalogModule { }
