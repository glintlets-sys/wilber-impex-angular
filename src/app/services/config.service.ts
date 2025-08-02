import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private myTenant: string = "wilber-prod"
  
  constructor(private http: HttpClient) {
  }

  getTenantDetails(): string {
    return this.myTenant;
  }
} 