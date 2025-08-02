import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { StockConsignmentComponent } from './stock-consignment.component';
import { AddEditConsignmentComponent } from './add-edit-consignment/add-edit-consignment.component';
import { StockExcelComponent } from './stock-excel/stock-excel.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    StockConsignmentComponent,
    AddEditConsignmentComponent,
    StockExcelComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule
  ],
  exports: [
    StockConsignmentComponent
  ]
})
export class StockConsignmentModule { }
