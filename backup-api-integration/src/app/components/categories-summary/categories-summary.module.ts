import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesSummaryRoutingModule } from './categories-summary-routing.module';
import { CategoriesSummaryComponent } from './categories-summary.component';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AgeCategoryModule } from '../age-category/age-category.module';


@NgModule({
  declarations: [
    CategoriesSummaryComponent
  ],
  imports: [
    CommonModule,
    CategoriesSummaryRoutingModule,
    CatalogItemModule,
    RouterModule,
    MatDialogModule,
    AgeCategoryModule
  ],
  exports: [
    CategoriesSummaryComponent
  ]
})
export class CategoriesSummaryModule { }
