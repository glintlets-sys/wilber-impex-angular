import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingSkillmaticsRoutingModule } from './landing-skillmatics-routing.module';
import { LandingSkillmaticsComponent } from './landing-skillmatics.component';
import { TopCategoriesModule } from '../top-categories/top-categories.module';


@NgModule({
  declarations: [
    LandingSkillmaticsComponent
  ],
  imports: [
    CommonModule,
    LandingSkillmaticsRoutingModule,
    TopCategoriesModule
  ]
})
export class LandingSkillmaticsModule { }
