import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<string, HttpResponse<any>> = new Map();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is a GET request and has cacheable criteria
    if (request.method === 'GET' && (request.url.includes('combinedResult') || request.url.includes('toys')) ) {
      const cachedResponse = this.cache.get(request.urlWithParams);
      if (cachedResponse) {
        // Return the cached response if available
        return of(cachedResponse.clone());
      } else {
        // Continue with the actual HTTP request
        return next.handle(request).pipe(
          // Cache the response
          tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.cache.set(request.urlWithParams, event.clone());
            }
          })
        );
      }
    }

    // Pass through for non-cacheable requests
    return next.handle(request);
  }
}
