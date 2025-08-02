import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAdminUserComponent } from './add-admin-user.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddAdminUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule

  ],
  exports: [
    AddAdminUserComponent
  ]
})
export class AddAdminUserModule { }
