import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutusRoutingModule } from './aboutus-routing.module';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    AboutusComponent
  ],
  imports: [
    AboutusRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule
  ],
  exports: [
    AboutusComponent
  ]
})
export class AboutusModule { }
