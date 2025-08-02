import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentDoneComponent } from './payment-done.component';

const routes: Routes = [{ path: '', component: PaymentDoneComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentDoneRoutingModule { }
