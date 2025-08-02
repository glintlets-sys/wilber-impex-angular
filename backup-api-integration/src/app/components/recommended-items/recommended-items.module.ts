import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';
import { RecommendedItemsRoutingModule } from './recommended-items-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { RecommendedItemsComponent } from './recommended-items.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    RecommendedItemsComponent
  ],
  imports: [
    CommonModule,
    RecommendedItemsRoutingModule,
    SharedModule,
    LoadingOverlayModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    RecommendedItemsComponent
  ]
})
export class RecommendedItemsModule { }
