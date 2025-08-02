import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ToyListComponent } from './toy-list.component';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';
import { AddToysModalComponent } from './add-toys-modal/add-toys-modal.component';
import { ExcelModule } from 'src/app/shared/excel/excel.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    ToyListComponent,
    AddToysModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoadingOverlayModule,
    ExcelModule,
    NgxPaginationModule
  ],
  exports: [
    ToyListComponent,
    ExcelModule
  ]
})
export class ToyListModule { }
