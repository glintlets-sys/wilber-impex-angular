import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendedItemsComponent } from './recommended-items.component';

const routes: Routes = [{ path: '', component: RecommendedItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecommendedItemsRoutingModule { }
