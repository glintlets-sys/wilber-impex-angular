import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { StocksComponent } from './stocks.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    StocksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule
  ],
  exports : [
    StocksComponent
  ]
})
export class StocksModule { }
