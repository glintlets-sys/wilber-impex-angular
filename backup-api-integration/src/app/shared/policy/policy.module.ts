import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from '../policy/policy.component';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    PolicyComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    PolicyComponent
  ]
})
export class PolicyModule { }
