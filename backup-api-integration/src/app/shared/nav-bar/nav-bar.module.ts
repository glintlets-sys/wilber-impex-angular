import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { NavBarComponent } from './nav-bar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoginpageModule } from 'src/app/components/loginpage/loginpage.module';
import { BlogsModule } from 'src/app/components/blogs/blogs.module';
import { AboutusModule } from '../aboutus/aboutus.module';
import { PolicyModule } from '../policy/policy.module';
import { TermsModule } from '../terms/terms.module';
import { AppModule } from 'src/app/app.module';


@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CollapseModule,
    RouterModule,
    //BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    LoginpageModule,
    BlogsModule,
    AboutusModule,
    PolicyModule,
    TermsModule

  ],
  exports: [
    NavBarComponent
  ]
})
export class NavbarModule { }
