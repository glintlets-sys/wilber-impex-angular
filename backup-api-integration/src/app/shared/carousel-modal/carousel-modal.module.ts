import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { CarouselModalComponent } from './carousel-modal.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    CarouselModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CarouselModule,
    BrowserAnimationsModule
  ],
  exports: [
    CarouselModalComponent
  ]
})
export class CarouselModalModule { }
