import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from '../product/product.component';
import { FormsModule } from '@angular/forms';
import { AgeBasedCatalogModule } from 'src/app/components/age-based-catalog/age-based-catalog.module';
import { BreadCrumbModule } from 'src/app/components/bread-crumb/bread-crumb.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CommentsModule } from 'src/app/components/comments/comments.module';
import { RouterModule } from '@angular/router';
import { CheckoutModule } from 'src/app/components/checkout/checkout.module';
import { LoginpageModule } from 'src/app/components/loginpage/loginpage.module';
import { CatalogItemModule } from 'src/app/components/catalog-item/catalog-item.module';
import { LandingBoughtTogetherModule } from 'src/app/components/landing-bought-together/landing-bought-together.module';
import { ToastModule } from 'src/app/shared/toast/toast.module';

@NgModule({
  declarations: [
    ProductComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductRoutingModule,
    CarouselModule,
    AgeBasedCatalogModule,
    BreadCrumbModule,
    CommentsModule,
    CheckoutModule,
    LoginpageModule,
    CatalogItemModule,
    LandingBoughtTogetherModule,
    ToastModule
  ],

})
export class ProductModule { }
