import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';
import { RouterModule } from '@angular/router';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';


@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    HttpClientModule,
    FormsModule,
    CatalogItemModule,
    RouterModule,
    LoadingOverlayModule
  ], 
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
