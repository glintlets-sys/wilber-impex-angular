import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockConsignment } from '../../app/services/StockConsignment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockConsignmentService {
  private apiUrl = environment.serviceURL + 'stockConsignment';

  constructor(private http: HttpClient) { }

  getAllStockConsignments(): Observable<StockConsignment[]> {
    return this.http.get<StockConsignment[]>(`${this.apiUrl}/`);
  }

  getStockConsignmentById(id: number): Observable<StockConsignment> {
    return this.http.get<StockConsignment>(`${this.apiUrl}/${id}`);
  }

  createStockConsignment(stockConsignment: StockConsignment): Observable<StockConsignment> {
    return this.http.post<StockConsignment>(`${this.apiUrl}/`, stockConsignment);
  }

  createStockConsignments(stockConsignments: StockConsignment[]): Observable<StockConsignment[]> {
    return this.http.post<StockConsignment[]>(`${this.apiUrl}/bulk`, stockConsignments);
  }

  updateStockConsignment(id: number, stockConsignment: StockConsignment): Observable<StockConsignment> {
    return this.http.put<StockConsignment>(`${this.apiUrl}/${id}`, stockConsignment);
  }

  deleteStockConsignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateStock(consignmentId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/generateStock/${consignmentId}`);
  }

  updateStockConsignmentItem(stockConsignment: StockConsignment): Observable<StockConsignment> {
    return this.http.put<StockConsignment>(`${this.apiUrl}/`, stockConsignment);
  }
}
