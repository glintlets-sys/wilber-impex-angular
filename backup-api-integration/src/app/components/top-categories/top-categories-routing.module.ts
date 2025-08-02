import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopCategoriesComponent } from './top-categories.component';

const routes: Routes = [{ path: '', component: TopCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopCategoriesRoutingModule { }
