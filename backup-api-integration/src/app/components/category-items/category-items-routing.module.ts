import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryItemsComponent } from './category-items.component';

const routes: Routes = [{ path: '', component: CategoryItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryItemsRoutingModule { }
