import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = environment.serviceURL  + 'api/discounts'; // Adjust as per your API URL

  constructor(private http: HttpClient) { }

  updateDiscount(itemId: number, discountPercent: number): Observable<string> {
    const requestBody = { discountPercent };
    return this.http.put<string>(`${this.apiUrl}/${itemId}`, requestBody);
  }
}
