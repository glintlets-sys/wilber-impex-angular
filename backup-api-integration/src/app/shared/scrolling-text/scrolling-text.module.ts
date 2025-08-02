import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ScrollingTextComponent } from './scrolling-text.component';

@NgModule({
  declarations: [
    ScrollingTextComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ScrollingTextComponent
  ]
})
export class ScrollingTextModule { }
