import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgeBasedCatalogComponent } from './age-based-catalog.component';

const routes: Routes = [{ path: '', component: AgeBasedCatalogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgeBasedCatalogRoutingModule { }
