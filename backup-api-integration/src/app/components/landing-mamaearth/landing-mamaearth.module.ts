import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingMamaearthRoutingModule } from './landing-mamaearth-routing.module';
import { LandingMamaearthComponent } from './landing-mamaearth.component';
import { TopCategoriesModule } from '../top-categories/top-categories.module';


@NgModule({
  declarations: [
    LandingMamaearthComponent
  ],
  imports: [
    CommonModule,
    LandingMamaearthRoutingModule,
    TopCategoriesModule
  ]
})
export class LandingMamaearthModule { }
