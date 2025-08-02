import { RecommendedItemsModule } from './components/recommended-items/recommended-items.module';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./services/auth-guard.service";
import { NotfoundComponent } from './shared/notfound/notfound.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: "full" },
  { path: 'home', loadChildren: () => import('./components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'login', loadChildren: () => import('./components/loginpage/loginpage.module').then(m => m.LoginpageModule) },
  { path: 'product/:itemId', loadChildren: () => import('./sections/product/product.module').then(m => m.ProductModule) },
  { path: 'categoryItems', loadChildren: () => import('./components/category-items/category-items.module').then(m => m.CategoryItemsModule) },
  { path: 'categoryItems/:categoryId', loadChildren: () => import('./components/category-items/category-items.module').then(m => m.CategoryItemsModule) },
  { path: 'shipmentPolicy', loadChildren: () => import('./shared/shipment-policy/shipment-policy.module').then(m => m.ShipmentPolicyModule) },
  { path: 'aboutus', loadChildren: () => import('./shared/aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'search', loadChildren: () => import('./components/search/search.module').then(m => m.SearchModule) },
  { path: 'cart', loadChildren: () => import('./components/cart/cart.module').then(m => m.CartModule), canActivate: [AuthGuard], },
  { path: 'myaccount', loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule), canActivate: [AuthGuard], },
  { path: 'myaccount/:productId', loadChildren: () => import('./shared/product-review/product-review.module').then(m => m.ProductReviewModule) },
  { path: 'aboutus', loadChildren: () => import('./shared/aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'terms', loadChildren: () => import('./shared/terms/terms.module').then(m => m.TermsModule) },
  { path: 'policy', loadChildren: () => import('./shared/policy/policy.module').then(m => m.PolicyModule) },
  { path: 'blogs', loadChildren: () => import('./components/blogs/blogs.module').then(m => m.BlogsModule) },
  { path: 'bundle', loadChildren: () => import('./shared/bundle/bundle.module').then(m => m.BundleModule) },
  // { path: 'checkout', loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule) },
  {
    path: 'checkout',
    loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule)
  },

  { path: 'purchase-response', loadChildren: () => import('./components/purchase-response/purchase-response.module').then(m => m.PurchaseResponseModule) },
  { path: 'aboutus', loadChildren: () => import('./shared/aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'terms', loadChildren: () => import('./shared/terms/terms.module').then(m => m.TermsModule) },
  { path: 'policy', loadChildren: () => import('./shared/policy/policy.module').then(m => m.PolicyModule) },
  { path: 'blogs', loadChildren: () => import('./components/blogs/blogs.module').then(m => m.BlogsModule) },
  { path: 'myorders', loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'myorders/:status', loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'myorders/phonepe/:orderId', loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'feedback', loadChildren: () => import('./components/feedback/feedback.module').then(m => m.FeedbackModule) },
  { path: 'readblogs', loadChildren: () => import('./components/blogs/blogs.module').then(m => m.BlogsModule) },
  { path: 'blog/:id', loadChildren: () => import('./shared/blog/blog.module').then(m => m.BlogModule) },
  { path: 'categoriesSummary/:categoryId', loadChildren: () => import('./components/categories-summary/categories-summary.module').then(m => m.CategoriesSummaryModule) },
  { path: 'categoriesSummary', loadChildren: () => import('./components/categories-summary/categories-summary.module').then(m => m.CategoriesSummaryModule) },
  { path: 'ageBasedCatalog/:ageCategory', loadChildren: () => import('./components/age-based-catalog/age-based-catalog.module').then(m => m.AgeBasedCatalogModule) },
  { path: 'Comments', loadChildren: () => import('./components/comments/comments.module').then(m => m.CommentsModule) },
  { path: 'shipmentPolicy', loadChildren: () => import('./shared/shipment-policy/shipment-policy.module').then(m => m.ShipmentPolicyModule) },
  { path: 'top-categories', loadChildren: () => import('./components/top-categories/top-categories.module').then(m => m.TopCategoriesModule) },
  { path: 'payment', loadChildren: () => import('./components/payment/payment.module').then(m => m.PaymentModule) },
  { path: 'payment-done', loadChildren: () => import('./components/payment-done/payment-done.module').then(m => m.PaymentDoneModule) },
  { path: 'admin-users', loadChildren: () => import('./components/admin-users/admin-users.module').then(m => m.AdminUsersModule) },
  { path: 'add-admin-user', loadChildren: () => import('./components/admin-users/add-admin-user/add-admin-user.module').then(m => m.AddAdminUserModule) },
  { path: 'manage-recommended-modal', loadChildren: () => import('./components/recommended-items/manage-recommended-modal/manage-recommended-modal.module').then(m => m.ManageRecommendedModalModule) },
  { path: 'mamaearth', loadChildren: () => import('./components/landing-mamaearth/landing-mamaearth.module').then(m => m.LandingMamaearthModule) },
  { path: 'himalaya', loadChildren: () => import('./components/landing-himalaya/landing-himalaya.module').then(m => m.LandingHimalayaModule) },
  { path: 'skillmatics', loadChildren: () => import('./components/landing-skillmatics/landing-skillmatics.module').then(m => m.LandingSkillmaticsModule) },
  { path: 'invoice/:id', loadChildren: () => import('./shared/invoice/invoice.module').then(m => m.InvoiceModule) },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true,
      useHash: true,
      scrollPositionRestoration: "top",
      anchorScrolling: "enabled",
      onSameUrlNavigation: "reload",
      scrollOffset: [0, 64]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
