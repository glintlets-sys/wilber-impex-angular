import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from '../terms/terms.component';
import { SharedModule } from '../../shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    CommonModule,
    TermsRoutingModule,
    RouterModule,
    FormsModule
  ],
  exports: 
  [
    TermsComponent
  ]
})
export class TermsModule { }
