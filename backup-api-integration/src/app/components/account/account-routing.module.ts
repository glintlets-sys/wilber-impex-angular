import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../account/account.component';


const routes: Routes = [{ path: '', component: AccountComponent },
{ path: 'orderHistory', component: AccountComponent },
{ path: 'orderSuccess', component: AccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
