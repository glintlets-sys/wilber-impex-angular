import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingSkillmaticsComponent } from './landing-skillmatics.component';

const routes: Routes = [{ path: '', component: LandingSkillmaticsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingSkillmaticsRoutingModule { }
