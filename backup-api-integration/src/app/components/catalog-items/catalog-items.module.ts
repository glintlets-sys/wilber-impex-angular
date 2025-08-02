import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItemsComponent } from './catalog-items.component';
import { CatalogItemModule } from '../catalog-item/catalog-item.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    CatalogItemsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CatalogItemModule,
  
    TabsModule.forRoot(),
    CarouselModule

  ],
  exports: [
    CatalogItemsComponent
  ]
})
export class CatalogItemsModule { }
