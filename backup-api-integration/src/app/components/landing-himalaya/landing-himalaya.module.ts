import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingHimalayaRoutingModule } from './landing-himalaya-routing.module';
import { LandingHimalayaComponent } from './landing-himalaya.component';
import { TopCategoriesModule } from '../top-categories/top-categories.module';


@NgModule({
  declarations: [
    LandingHimalayaComponent
  ],
  imports: [
    CommonModule,
    LandingHimalayaRoutingModule,
    TopCategoriesModule
  ]
})
export class LandingHimalayaModule { }
