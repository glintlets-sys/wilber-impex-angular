import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadCrumbRoutingModule } from './bread-crumb-routing.module';
import { BreadCrumbComponent } from './bread-crumb.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BreadCrumbComponent
  ],
  imports: [
    CommonModule,
    BreadCrumbRoutingModule,
    FormsModule
  ],
  exports: [
    BreadCrumbComponent
  ]
})
export class BreadCrumbModule { }
