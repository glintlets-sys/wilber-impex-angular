import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ToastComponent } from './toast.component';

@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ToastComponent
  ]
})
export class ToastModule { }
