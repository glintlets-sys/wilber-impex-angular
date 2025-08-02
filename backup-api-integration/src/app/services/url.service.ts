import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

  getOriginUrl(): string {
    return window.location.origin;
  }


}
