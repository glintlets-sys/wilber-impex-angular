import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { DispatchDetailsComponent } from './dispatch-details.component';

@NgModule({
  declarations: [
    DispatchDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DispatchDetailsComponent
  ]
})
export class DispatchDetailsModule { }
