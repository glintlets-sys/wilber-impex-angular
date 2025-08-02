import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUsersRoutingModule } from './admin-users-routing.module';
import { AdminUsersComponent } from './admin-users.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AdminUsersComponent
  ],
  imports: [
    CommonModule,
    AdminUsersRoutingModule,
    FormsModule,
    NgxPaginationModule

  ],
  exports: [
    AdminUsersComponent
  ]
})
export class AdminUsersModule { }
