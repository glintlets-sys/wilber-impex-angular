import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { BackButtonComponent } from './back-button.component';

@NgModule({
  declarations: [
    BackButtonComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    BackButtonComponent
  ]
})
export class BackButtonModule { }
