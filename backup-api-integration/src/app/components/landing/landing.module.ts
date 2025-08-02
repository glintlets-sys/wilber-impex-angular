import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './../landing/landing.component';
import { AgeCategoryModule } from '../age-category/age-category.module';
import { CatalogItemsModule } from '../catalog-items/catalog-items.module';
import { RouterModule } from '@angular/router';
import { AdminCategoryModule } from '../admin-category/admin-category.module';
import { CategoriesSummaryModule } from '../categories-summary/categories-summary.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PromotedCategoriesModule } from '../promoted-categories/promoted-categories.module';
import { TopCategoriesModule } from '../top-categories/top-categories.module';


@NgModule({
  declarations: [
    LandingComponent,
  ],
  imports: [
    LandingRoutingModule,
    RouterModule,
    CatalogItemsModule,
    AgeCategoryModule,
    CategoriesSummaryModule,
    FeedbackModule,
    CollapseModule,
    CarouselModule,
    PromotedCategoriesModule,
    TopCategoriesModule,
    CommonModule
  ]
})
export class LandingModule { }
