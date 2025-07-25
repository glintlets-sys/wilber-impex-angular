import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StoneSolutionsComponent } from './stone-solutions/stone-solutions.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'stone-solutions', component: StoneSolutionsComponent },
  { path: 'stone-solution/cementitious-tile-adhesive', component: CategoryDetailComponent },
  { path: 'stone-solution/epoxy-grout', component: CategoryDetailComponent },
  { path: 'stone-solution/sealers', component: CategoryDetailComponent },
  { path: 'stone-solution/cleaners', component: CategoryDetailComponent },
  { path: 'stone-solution/mastic', component: CategoryDetailComponent },
  { path: 'stone-solution/epoxy-products', component: CategoryDetailComponent },
  { path: 'stone-solution/ager-polish', component: CategoryDetailComponent },
  { path: 'stone-solution/lapizo-bond', component: CategoryDetailComponent },
  { path: 'stone-solution/marble-densifier', component: CategoryDetailComponent },
  { path: '**', redirectTo: '' }
];
