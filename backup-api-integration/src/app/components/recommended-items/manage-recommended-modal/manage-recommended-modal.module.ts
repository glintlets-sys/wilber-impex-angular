import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRecommendedModalRoutingModule } from './manage-recommended-modal-routing.module';
import { ManageRecommendedModalComponent } from './manage-recommended-modal.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ManageRecommendedModalComponent
  ],
  imports: [
    CommonModule,
    ManageRecommendedModalRoutingModule,
    FormsModule,
    NgSelectModule
  ]
})
export class ManageRecommendedModalModule { }
