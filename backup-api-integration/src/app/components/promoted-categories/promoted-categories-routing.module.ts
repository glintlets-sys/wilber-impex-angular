import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotedCategoriesComponent } from './promoted-categories.component';

const routes: Routes = [{ path: '', component: PromotedCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotedCategoriesRoutingModule { }
