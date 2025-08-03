import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Services
import { AddressService } from '../address.service';
import { AuthenticationService } from '../authentication.service';
import { AuthGuard } from '../auth-guard.service';
import { AwsImageService } from '../aws-image.service';
import { BlogDataService } from '../blog-data.service';
import { CartService } from '../cart.service';
import { CatalogService } from '../catalog.service';
import { CategoryService } from '../category.service';
import { ConfigService } from '../config.service';
import { StockConsignmentService } from '../consignment.service';
import { ConvertToWordsPipe } from '../convert-to-words.pipe';
import { CouponService } from '../coupon.service';
import { DiscountService } from '../discount.service';
import { DispatchService } from '../dispatch.service';
import { EncryptionService } from '../encryption.service';
import { FeedbackService } from '../feedback.service';
import { HeaderInterceptor } from '../header-interceptor';
import { ItemRecommendationService } from '../item-recommendation.service';
import { LoadingOverlayService } from '../loading-overlay.service';
import { OfflineCartService } from '../offline-cart.service';
import { OrderService } from '../order.service';
import { PaymentService } from '../payment.service';
import { PhonePePaymentService } from '../phone-pe-payment.service';
import { RatingService } from '../rating-service.service';
import { RecommendationsTsService } from '../recommendations.ts.service';
import { SearchService } from '../search.service';
import { ShiprocketService } from '../shiprocket/shiprocket.service';
import { SMSService } from '../sms.service';
import { StockConsignmentService as StockConsignmentServiceMain } from '../stock-consignment.service';
import { StockService } from '../stock.service';
import { ToasterService } from '../toaster.service';
import { ToyService } from '../toy.service';
import { UrlService } from '../url.service';
import { UserService } from '../user.service';
import { NotifyMeService } from '../notifyMeService/notify-me.service';
import { ConfigurationService } from '../configurationService/configuration.service';
import { BoughtTogetherService } from '../boughtTogetherService/bought-together.service';

@NgModule({
  declarations: [
    ConvertToWordsPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    ConvertToWordsPipe
  ]
})
export class SharedServicesModule {
  static forRoot(): ModuleWithProviders<SharedServicesModule> {
    return {
      ngModule: SharedServicesModule,
      providers: [
        ConfigService,
        // Core Services
        AddressService,
        AuthenticationService,
        AuthGuard,
        AwsImageService,
        BlogDataService,
        CartService,
        CatalogService,
        CategoryService,
        StockConsignmentService,
        CouponService,
        DiscountService,
        DispatchService,
        EncryptionService,
        FeedbackService,
        ItemRecommendationService,
        LoadingOverlayService,
        OfflineCartService,
        OrderService,
        PaymentService,
        PhonePePaymentService,
        RatingService,
        RecommendationsTsService,
        SearchService,
        ShiprocketService,
        SMSService,
        StockConsignmentServiceMain,
        StockService,
        ToasterService,
        ToyService,
        UrlService,
        UserService,
        
        // Subdirectory Services
        NotifyMeService,
        ConfigurationService,
        BoughtTogetherService
      ]
    };
  }
} 