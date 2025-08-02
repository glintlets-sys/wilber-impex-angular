import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';

export const HeaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let authToken = '';
  const configService = inject(ConfigService);
  let tenant = configService.getTenantDetails(); // Get tenant from config service

  // Get auth token from localStorage
  const userDetailsStr = localStorage.getItem(environment.USER_DETAILS);
  if (userDetailsStr !== null && userDetailsStr !== '') {
    try {
      const userDetails = JSON.parse(userDetailsStr);
      authToken = userDetails.authToken || '';
    } catch (error) {
      console.error('Error parsing user details from localStorage:', error);
    }
  }

  // Skip interceptor for external APIs
  if (request.url.startsWith('https://api.phonepe.com') ||
      request.url.startsWith('https://api-preprod.phonepe.com') ||
      request.url.startsWith('https://apiv2.shiprocket.in')) {
    return next(request);
  }

  // Handle pre-flight requests
  if (request.method === 'OPTIONS') {
    const modifiedRequest = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${authToken}`)
        .set('x-tenant', tenant)
    });
    return next(modifiedRequest);
  }

  // Add authentication and tenant headers
  const modifiedRequest = request.clone({
    headers: request.headers
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-tenant', tenant)
      .set('Content-Type', 'application/json')
  });

  return next(modifiedRequest);
}; 