import { NgModule } from '@angular/core';

import { CategoryItemsRoutingModule } from './category-items-routing.module';
import { CategoryItemsComponent } from './category-items.component';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';
import { FilterModule } from '../filter/filter.module';
import { BreadCrumbModule } from '../bread-crumb/bread-crumb.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortDataPipe } from 'src/app/shared/sorting-pipe/sort.pipe';


@NgModule({
  declarations: [
    CategoryItemsComponent,
    SortDataPipe
  ],
  imports: [
    CategoryItemsRoutingModule,
    CatalogItemModule,
    FilterModule,
    BreadCrumbModule,
    RouterModule,
    CommonModule,
    FormsModule
    
  ]
})
export class CategoryItemsModule { }
