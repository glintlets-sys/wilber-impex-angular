import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterRoutingModule } from './filter-routing.module';
import { FilterComponent } from './filter.component';
import { NouisliderModule } from 'ng2-nouislider';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    FilterRoutingModule,
    NouisliderModule,
    FormsModule
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterModule { }
