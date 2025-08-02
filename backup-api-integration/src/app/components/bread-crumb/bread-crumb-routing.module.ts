import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadCrumbComponent } from './bread-crumb.component';

const routes: Routes = [{ path: '', component: BreadCrumbComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreadCrumbRoutingModule { }
