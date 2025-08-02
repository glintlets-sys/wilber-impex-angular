import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { UserTableComponent } from './user-table.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    UserTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule
  ], 
  exports: [
    UserTableComponent
  ]
})
export class UserTableModule { }
