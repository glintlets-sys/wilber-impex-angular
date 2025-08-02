import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingHimalayaComponent } from './landing-himalaya.component';

const routes: Routes = [{ path: '', component: LandingHimalayaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingHimalayaRoutingModule { }
