import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BoughtTogether } from '../boughtTogether/bought-together';

@Injectable({
  providedIn: 'root'
})
export class BoughtTogetherService {

  private baseUrl = `${environment.serviceURL}api/bought-together`;
  private allBoughtTogetherCache: BoughtTogether[]; // Cache variable

  constructor(private http: HttpClient) { }

  getAllBoughtTogether(): Observable<BoughtTogether[]> {
    if (this.allBoughtTogetherCache) {
      return of(this.allBoughtTogetherCache); // Return cached data if available
    } else {
      return this.http.get<BoughtTogether[]>(`${this.baseUrl}/`).pipe(
        tap(data => this.allBoughtTogetherCache = data), // Cache the data
        catchError(error => {
          throw 'Error in fetching data: ' + error;
        })
      );
    }
  }

  getBoughtTogetherById(id: number): Observable<BoughtTogether> {
    return this.http.get<BoughtTogether>(`${this.baseUrl}/${id}`);
  }

  createBoughtTogether(boughtTogether: BoughtTogether): Observable<BoughtTogether> {
    return this.http.post<BoughtTogether>(`${this.baseUrl}/`, boughtTogether);
  }

  updateBoughtTogether(id: number, updatedBoughtTogether: BoughtTogether): Observable<BoughtTogether> {
    return this.http.put<BoughtTogether>(`${this.baseUrl}/${id}`, updatedBoughtTogether);
  }

  deleteBoughtTogether(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBoughtTogetherByItemId(itemId: number): Observable<BoughtTogether[]> {
    return this.http.get<BoughtTogether[]>(`${this.baseUrl}/items/${itemId}`);// 
  }

  getBoughtTogetherByItemIdBestChoice(itemId: string): Observable<BoughtTogether> {
    return this.http.get<BoughtTogether>(`${this.baseUrl}/items/${itemId}/maxDiscount`);
  }

  clearCache() {
    this.allBoughtTogetherCache = null;
  }

}
