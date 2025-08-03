import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockConsignment } from './StockConsignment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockConsignmentService {
  private apiUrl = environment.serviceURL + 'stockConsignment';

  constructor(private http: HttpClient) { }

  getAllStockConsignments(): Observable<StockConsignment[]> {
    return this.http.get<StockConsignment[]>(this.apiUrl + '/');
  }

  deleteStockConsignment(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  updateStockConsignment(stockConsignment: StockConsignment): Observable<StockConsignment> {
    const url = `${this.apiUrl}/${stockConsignment.id}`;
    return this.http.put<StockConsignment>(url, stockConsignment);
  }

  generateStocks(stocksId: StockConsignment): Observable<StockConsignment[]> {
    return this.http.get<StockConsignment[]>(this.apiUrl + '/generateStock/' + stocksId);
  }

}
