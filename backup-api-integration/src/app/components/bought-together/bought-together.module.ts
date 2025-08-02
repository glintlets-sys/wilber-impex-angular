import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoughtTogetherComponent } from './bought-together.component';
import { BoughtTogetherRoutingModule } from './bought-together-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddtoysboughtComponent } from './addtoysbought/addtoysbought.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BoughtTogetherComponent,
    AddtoysboughtComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BoughtTogetherRoutingModule,
    NgxPaginationModule,
    NgSelectModule
  ],
  exports: [
    BoughtTogetherComponent
  ]
})
export class BoughtTogetherModule { }
