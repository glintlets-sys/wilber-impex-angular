import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentPolicyComponent } from './shipment-policy.component';

const routes: Routes = [{ path: '', component: ShipmentPolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentPolicyRoutingModule { }
