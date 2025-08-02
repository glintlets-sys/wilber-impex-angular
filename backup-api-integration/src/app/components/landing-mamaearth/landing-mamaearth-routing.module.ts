import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingMamaearthComponent } from './landing-mamaearth.component';

const routes: Routes = [{ path: '', component: LandingMamaearthComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingMamaearthRoutingModule { }
