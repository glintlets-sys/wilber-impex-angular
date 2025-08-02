"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = void 0;
var ngx_chips_1 = require("ngx-chips");
var animations_1 = require("@angular/platform-browser/animations"); // this is needed!
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var dropdown_1 = require("ngx-bootstrap/dropdown");
var progressbar_1 = require("ngx-bootstrap/progressbar");
var tooltip_1 = require("ngx-bootstrap/tooltip");
var collapse_1 = require("ngx-bootstrap/collapse");
var tabs_1 = require("ngx-bootstrap/tabs");
var pagination_1 = require("ngx-bootstrap/pagination");
var alert_1 = require("ngx-bootstrap/alert");
var datepicker_1 = require("ngx-bootstrap/datepicker");
var carousel_1 = require("ngx-bootstrap/carousel");
var modal_1 = require("ngx-bootstrap/modal");
var popover_1 = require("ngx-bootstrap/popover");
var timepicker_1 = require("ngx-bootstrap/timepicker");
var http_1 = require("@angular/common/http");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var platform_browser_1 = require("@angular/platform-browser");
var authentication_service_1 = require("./services/authentication.service");
var cart_service_1 = require("./services/cart.service");
var header_interceptor_1 = require("./services/header-interceptor");
var user_service_1 = require("./services/user.service");
var payment_service_1 = require("./services/payment.service");
var toaster_service_1 = require("./services/toaster.service");
var toast_component_1 = require("./shared/toast/toast.component");
var loading_overlay_service_1 = require("./services/loading-overlay.service");
var aws_image_service_1 = require("./services/aws-image.service");
var address_service_1 = require("./services/address.service");
var sms_service_1 = require("./services/sms.service");
var angular_ga_1 = require("angular-ga");
var cache_Interceptor_1 = require("./services/cache-Interceptor");
var recommendations_ts_service_1 = require("./services/recommendations.ts.service");
var feedback_service_1 = require("./services/feedback.service");
var coupon_service_1 = require("./services/coupon.service");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule,
                animations_1.BrowserAnimationsModule,
                dropdown_1.BsDropdownModule.forRoot(),
                progressbar_1.ProgressbarModule.forRoot(),
                tooltip_1.TooltipModule.forRoot(),
                timepicker_1.TimepickerModule.forRoot(),
                popover_1.PopoverModule.forRoot(),
                collapse_1.CollapseModule.forRoot(),
                ngx_chips_1.TagInputModule,
                tabs_1.TabsModule.forRoot(),
                pagination_1.PaginationModule.forRoot(),
                alert_1.AlertModule.forRoot(),
                datepicker_1.BsDatepickerModule.forRoot(),
                carousel_1.CarouselModule.forRoot(),
                modal_1.ModalModule.forRoot(),
                http_1.HttpClientModule,
                ng_bootstrap_1.NgbModule,
                platform_browser_1.BrowserModule
            ],
            exports: [
                common_1.CommonModule,
                forms_1.FormsModule
            ],
            entryComponents: [toast_component_1.ToastComponent],
            providers: [angular_ga_1.GoogleAnalyticsService, sms_service_1.SMSService, address_service_1.AddressService, CatalogService, authentication_service_1.AuthenticationService, cart_service_1.CartService, user_service_1.UserService, payment_service_1.PaymentService, toaster_service_1.ToasterService, AppComponent, aws_image_service_1.AwsImageService, loading_overlay_service_1.LoadingOverlayService, recommendations_ts_service_1.RecommendationsTsService, feedback_service_1.FeedbackService, coupon_service_1.CouponService,
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: header_interceptor_1.HeaderInterceptor,
                    multi: true
                },
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: cache_Interceptor_1.CacheInterceptor,
                    multi: true
                },
                { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy }
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
