import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ReachUsComponent } from './reach-us.component';

@NgModule({
  declarations: [
    ReachUsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReachUsComponent
  ]
})
export class ReachUsModule { }
