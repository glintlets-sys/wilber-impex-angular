import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { HeaderInterceptor } from './shared-services/header-interceptor';
import { ToasterService } from './shared-services/toaster.service';
import { SharedServicesModule } from './shared-services/module/shared-services.module';
import { ConfigService } from './shared-services/config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([HeaderInterceptor])),
    ConfigService,
    ToasterService,
    ...SharedServicesModule.forRoot().providers
  ]
};
