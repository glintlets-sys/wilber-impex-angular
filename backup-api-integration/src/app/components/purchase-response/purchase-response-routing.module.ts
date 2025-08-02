import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseResponseComponent } from '../purchase-response/purchase-response.component';

const routes: Routes = [{ path: '', component: PurchaseResponseComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseResponseRoutingModule { }
