import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyMeComponent } from './notify-me.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotifyUserComponent } from './notify-user/notify-user.component';

@NgModule({
  declarations: [
    NotifyMeComponent,
    NotifyUserComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [
    NotifyMeComponent
  ]
})
export class NotifyMeModule { }
