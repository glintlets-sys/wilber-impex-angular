import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ConfigService } from './config.service';

export const HeaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  const configService = inject(ConfigService);
  
  let authToken = '';
  let tenant = "";
  if ((localStorage.getItem('userDetails') !== null) && (localStorage.getItem('userDetails') !== '')) {
    authToken = JSON.parse(localStorage.getItem('userDetails')).authToken;
  }

  if(request.url.startsWith('https://api-preprod.phonepe.com')) {
    return next(request);
  }

  if(request.url.startsWith('https://api.phonepe.com')) {
    return next(request);
  }

  if(request.url.startsWith('https://apiv2.shiprocket.in')) {
    return next(request);
  }

  const tenantName = configService.getTenantDetails();
  console.log('🔍 [HeaderInterceptor] ConfigService tenant:', tenantName);
  if (tenantName) {
    tenant = tenantName;
    console.log('✅ [HeaderInterceptor] Using tenant:', tenant);
  } else {
    console.error('❌ [HeaderInterceptor] Config not loaded yet or failed to load');
    tenant = 'wilber-prod'; // Fallback to environment value
  }

  if (request.method === 'OPTIONS') {
    const modifiedRequestWithTenant = request.clone({
      headers: request.headers
        .set('Authorization', `Bearer ${authToken}`)
        .set('x-tenant', tenant)
    });
    
    console.log('🔍 [HeaderInterceptor] OPTIONS request with tenant:', tenant);
    return next(modifiedRequestWithTenant);
  }

  const modifiedRequest = request.clone({
    headers: request.headers
      .set('Authorization', `Bearer ${authToken}`)
      .set('x-tenant', tenant)
  });
  
  console.log('🔍 [HeaderInterceptor] Request with tenant:', tenant, 'URL:', request.url);
  return next(modifiedRequest);
};
