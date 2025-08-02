import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoughtTogetherComponent } from './bought-together.component';

const routes: Routes = [{ path: '', component: BoughtTogetherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoughtTogetherRoutingModule { }
