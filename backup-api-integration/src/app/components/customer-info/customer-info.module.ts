import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { CustomerInfoComponent } from './customer-info.component';
import { CategoryModule } from '../category/category.module';

@NgModule({
  declarations: [
    CustomerInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CategoryModule
  ],
  exports: [
    CustomerInfoComponent
  ]
})
export class CustomerInfoModule { }
