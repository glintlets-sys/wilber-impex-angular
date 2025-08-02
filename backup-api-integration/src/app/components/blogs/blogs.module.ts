import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsComponent } from './blogs.component';
import { BlogModule } from 'src/app/shared/blog/blog.module';
import { RouterModule } from '@angular/router';
import { BreadCrumbModule } from '../bread-crumb/bread-crumb.module';


@NgModule({
  declarations: [
    BlogsComponent
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    BlogModule,
    RouterModule,
    BreadCrumbModule
  ],
  exports: [
    BlogsComponent
  ]
})
export class BlogsModule { }
