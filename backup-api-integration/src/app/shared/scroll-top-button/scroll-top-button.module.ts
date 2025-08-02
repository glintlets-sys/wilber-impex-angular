import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ScrollTopButtonComponent } from './scroll-top-button.component';

@NgModule({
  declarations: [
    ScrollTopButtonComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ScrollTopButtonComponent
  ]
})
export class ScrollTopButtonModule { }
