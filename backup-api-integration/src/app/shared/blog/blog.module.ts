import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from '../blog/blog.component';
import { SharedModule } from '../../shared.module';
import { Router, RouterModule } from '@angular/router';
import { BreadCrumbModule } from 'src/app/components/bread-crumb/bread-crumb.module';


@NgModule({

  imports: [
    CommonModule,
    BlogRoutingModule,
    RouterModule,
    BreadCrumbModule
    
  ],
  declarations: [
    BlogComponent
  ],
  exports: [
    BlogComponent
  ]
})
export class BlogModule { }
