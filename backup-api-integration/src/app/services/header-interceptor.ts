import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {


    constructor(private configService: ConfigService) {
    }

    
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    let authToken = '';
    let tenant = "";
    if ((localStorage.getItem('userDetails') !== null) && (localStorage.getItem('userDetails') !== '')) {
      authToken = JSON.parse(localStorage.getItem('userDetails')).authToken;
    }

    if(request.url.startsWith('https://api-preprod.phonepe.com')) {
      //  console.log("Skiping intercept for url to payment gateway");
       return next.handle(request);
    }

    if(request.url.startsWith('https://api.phonepe.com')) {
      //  console.log("Skiping intercept for url to payment gateway");
       return next.handle(request);
    }

    
    if(request.url.startsWith('https://apiv2.shiprocket.in')) {
      //  console.log("Skiping intercept for url to payment gateway");
       return next.handle(request);
    }

    // console.log("intercepted URL " + request.url);
    // console.log("intercepted Method " + request.method);

    const tenantName = this.configService.getTenantDetails();
    if (tenantName) {
      tenant = tenantName; // Access the properties directly
    } else {
      // console.error('Config not loaded yet or failed to load');
    }

    if (request.method === 'OPTIONS') {
      // Handle pre-flight request separately
      const modifiedRequestWithTenant = request.clone({
        headers: request.headers
          .set('Authorization', `Bearer ${authToken}`)
          .set('x-tenant', tenant)
      });
      

      return next.handle(modifiedRequestWithTenant);
    }

  
    const modifiedRequest = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${authToken}`)
        .set('x-tenant', tenant)
    });
    
    
    return next.handle(modifiedRequest);
  } 
}
