import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { LoadingOverlayComponent } from './loading-overlay.component';

@NgModule({
  declarations: [
    LoadingOverlayComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    LoadingOverlayComponent
  ]
})
export class LoadingOverlayModule { }
