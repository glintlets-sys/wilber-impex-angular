import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { AwsImageListComponent } from './aws-image-list.component';

@NgModule({
  declarations: [
    AwsImageListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AwsImageListComponent
  ]
})
export class AwsImageListModule { }
