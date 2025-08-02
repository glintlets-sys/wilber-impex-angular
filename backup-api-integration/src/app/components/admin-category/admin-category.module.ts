import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCategoryComponent } from './admin-category.component';
import { FormsModule } from '@angular/forms';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { NouisliderModule } from 'ng2-nouislider';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AdminCategoryComponent,
    AddEditCategoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NouisliderModule,
    NgxPaginationModule
  ],
  exports: [
    AdminCategoryComponent
  ]
})
export class AdminCategoryModule { }
