import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageRecommendedModalComponent } from './manage-recommended-modal.component';

const routes: Routes = [{ path: '', component: ManageRecommendedModalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRecommendedModalRoutingModule { }
