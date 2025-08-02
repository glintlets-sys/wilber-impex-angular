import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from '../feedback/feedback.component';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    FeedbackComponent
  ]
})
export class FeedbackModule { }
