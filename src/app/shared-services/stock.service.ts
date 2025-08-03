import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock, StockStatus, ItemStock } from './stock';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.serviceURL + 'stock'; // Replace with your API URL

  constructor(private http: HttpClient) { }


  downloadExcelFile(): Observable<Blob> {
    return this.http.get(this.apiUrl + "/download-excel", {
      responseType: 'blob', // Important to process binary data
      headers: new HttpHeaders({
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
    });
  }

  public getItemStock(stocks: Stock[]): ItemStock[] {
    const itemStockArray: ItemStock[] = [];
    const itemStockMap: Map<number, ItemStock> = new Map();

    stocks.forEach(stock => {
      const { itemId, stockStatus, lockedStock, name, brand } = stock;
      if (!itemStockMap.has(itemId)) {
        itemStockMap.set(itemId, {
          name: name,
          brand: brand,
          itemId: itemId,
          quantity: 0,
          locked: 0,
          active: 0,
          ready: 0,
          addedToCart: 0,
          sold: 0
        });
        itemStockArray.push(itemStockMap.get(itemId));
      }

      const itemStock = itemStockMap.get(itemId);
      itemStock.quantity++;

      if (lockedStock) {
        itemStock.locked++;
      }

      switch (stockStatus) {
        case StockStatus.ACTIVE:
          itemStock.active++;
          break;
        case StockStatus.READY:
          itemStock.ready++;
          break;
        case StockStatus.ADDEDTOCART:
          itemStock.addedToCart++;
          break;
        case StockStatus.SOLD:
          itemStock.sold++;
          break;
        default:
          break;
      }
    });

    return itemStockArray;
  }

  getAllStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl + '/');
  }

  getStockById(id: number): Observable<Stock> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Stock>(url);
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  updateStock(id: number, stock: Stock): Observable<Stock> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Stock>(url, stock);
  }

  deleteStock(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  activateStock(consignmentId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate/${consignmentId}`, {});
  }

}
