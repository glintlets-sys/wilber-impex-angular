
import { NgModule } from "@angular/core";
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { HTTP_INTERCEPTORS  } from "@angular/common/http";
import { HeaderInterceptor } from './services/header-interceptor';
import { CacheInterceptor } from "./services/cache-Interceptor";
import { BackButtonModule } from "./shared/back-button/back-button.module";
import { ScrollTopButtonModule } from "./shared/scroll-top-button/scroll-top-button.module";
import { LoadingOverlayModule } from "./shared/loading-overlay/loading-overlay.module";
import { ToastModule } from "./shared/toast/toast.module";
import { NavbarModule } from "./shared/nav-bar/nav-bar.module";
import { FooterModule } from "./shared/footer/footer.module";
import { GoogleAnalyticsService } from "angular-ga";
import { AddressService } from "./services/address.service";
import { AuthenticationService } from "./services/authentication.service";
import { AwsImageService } from "./services/aws-image.service";
import { CartService } from "./services/cart.service";
import { CatalogService } from "./services/catalog.service";
import { CouponService } from "./services/coupon.service";
import { FeedbackService } from "./services/feedback.service";
import { LoadingOverlayService } from "./services/loading-overlay.service";
import { PaymentService } from "./services/payment.service";
import { RecommendationsTsService } from "./services/recommendations.ts.service";
import { SMSService } from "./services/sms.service";
import { ToasterService } from "./services/toaster.service";
import { UserService } from "./services/user.service";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { TagInputModule } from "ngx-chips";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { TabsModule } from "ngx-bootstrap/tabs";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { ModalModule } from "ngx-bootstrap/modal";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { HttpClientModule } from "@angular/common/http";
import { LandingModule } from "./components/landing/landing.module";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ToastComponent } from "./shared/toast/toast.component";
import { CategoryService } from "./services/category.service";
import { BlogDataService } from "./services/blog-data.service";
import { WhatsappWidgetComponent } from "./components/whatsapp-widget/whatsapp-widget.component";
import { AgeBasedCatalogModule } from './components/age-based-catalog/age-based-catalog.module';
import { CarouselModule as OwlCarouselModule } from 'ngx-owl-carousel-o';
import { NouisliderModule } from "ng2-nouislider";
import { SearchModule } from "./components/search/search.module";
import { SearchService } from "./services/search.service";
import { RatingService } from "./services/rating-service.service";
import { PolicyModule } from "./shared/policy/policy.module";
import { PhonePePaymentService } from "./services/phone-pe-payment.service";
import { CategoryItemsModule } from "./components/category-items/category-items.module";
import { InvoiceModule } from "./shared/invoice/invoice.module";
import { ConfigurationService } from "./services/configurationService/configuration.service";
import { DispatchService } from "./services/dispatch.service";
import { NotfoundComponent } from './shared/notfound/notfound.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPaginationModule} from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    WhatsappWidgetComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BackButtonModule,
    ScrollingModule,
    ScrollTopButtonModule,
    LoadingOverlayModule,
    ToastModule,
    NavbarModule,
    FooterModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    LandingModule,
    AgeBasedCatalogModule,
    OwlCarouselModule, 
    TabsModule.forRoot(),
    NouisliderModule,
    SearchModule,
    LoadingOverlayModule,
    PolicyModule,
    CategoryItemsModule,
    InvoiceModule,
    NgSelectModule,
    NgxPaginationModule
    ],
  entryComponents: [ToastComponent],
  providers: [ConfigurationService, DispatchService, PhonePePaymentService, RatingService, SearchService, GoogleAnalyticsService, BlogDataService, CategoryService, SMSService, AddressService, CatalogService, AuthenticationService, CartService, UserService, PaymentService, ToasterService, AwsImageService, LoadingOverlayService, RecommendationsTsService, FeedbackService, CouponService, CatalogService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HeaderInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CacheInterceptor,
        multi: true,
      },
      { provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private router: Router) {
  //  console.log(this.router.config);
  }


}


