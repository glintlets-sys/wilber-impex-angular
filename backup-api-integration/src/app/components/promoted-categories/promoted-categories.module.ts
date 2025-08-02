import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotedCategoriesRoutingModule } from './promoted-categories-routing.module';
import { PromotedCategoriesComponent } from './promoted-categories.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    PromotedCategoriesComponent
  ],
  imports: [
    CommonModule,
    PromotedCategoriesRoutingModule,
    CarouselModule
  ],
  exports: [
    PromotedCategoriesComponent
  ]
})
export class PromotedCategoriesModule { }
