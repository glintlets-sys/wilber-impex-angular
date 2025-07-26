import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StoneSolutionsComponent } from './stone-solutions/stone-solutions.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { ProductComponent } from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'aboutus', component: AboutComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'stone-solutions', component: StoneSolutionsComponent },
  { path: 'stone-solution/:category', component: CategoryDetailComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', redirectTo: '' }
];
