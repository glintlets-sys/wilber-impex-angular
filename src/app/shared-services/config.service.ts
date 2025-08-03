import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private myTenant: string = environment.tenant;
  
  constructor(private http: HttpClient) {
  }

  setTenant(tenant: string): void {
    this.myTenant = tenant;
  }

  getTenantDetails(): string  {
    return this.myTenant;
  }
}
