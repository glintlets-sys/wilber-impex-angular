import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private myTenant: string = "colourcubs-p"
  constructor(private http: HttpClient) {
  }

  getTenantDetails(): string  {
    return this.myTenant;
  }
}
