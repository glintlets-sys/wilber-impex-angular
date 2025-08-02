import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesSummaryComponent } from './categories-summary.component';

const routes: Routes = [{ path: '', component: CategoriesSummaryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesSummaryRoutingModule { }
