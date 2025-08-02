import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared.module';
import { AgeCategoryComponent } from './age-category.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';



@NgModule({
  declarations: [
    AgeCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CatalogItemModule
  ],
  exports: [
    AgeCategoryComponent
  ]
})
export class AgeCategoryModule { }
