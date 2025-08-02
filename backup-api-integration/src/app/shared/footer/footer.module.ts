import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { FooterComponent } from './footer.component';
import { RouterModule } from '@angular/router';
import { LoginpageModule } from 'src/app/components/loginpage/loginpage.module';
import { BlogsModule } from 'src/app/components/blogs/blogs.module';
import { AboutusModule } from '../aboutus/aboutus.module';
import { PolicyModule } from '../policy/policy.module';
import { TermsModule } from '../terms/terms.module';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LoginpageModule,
    BlogsModule,
    AboutusModule,
    PolicyModule,
    TermsModule,
    CollapseModule.forRoot()
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule { }
