import { NgModule } from '@angular/core';
import { LoginpageRoutingModule } from './loginpage-routing.module';
import { LoginpageComponent } from '../loginpage/loginpage.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'src/app/shared/toast/toast.module';
import { LoadingOverlayModule } from 'src/app/shared/loading-overlay/loading-overlay.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    LoginpageComponent
  ],
  imports: [
    LoginpageRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    LoadingOverlayModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot()
  ],
  exports: [
    LoginpageComponent
  ]
})
export class LoginpageModule { }
