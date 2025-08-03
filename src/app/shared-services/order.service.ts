import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OrderDTO, OrderedItem } from './order';
import { environment } from '../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.serviceURL + 'api/purchases';
  private orderItemCache: { [userId: string]: OrderedItem[] } = {};

  constructor(private http: HttpClient) { }

  getOrders(userId: string): Observable<OrderDTO[]> {
    const url = `${this.apiUrl}/user/${userId}`;
    return this.http.get<OrderDTO[]>(url);
  }

  getOrderedItems(userId: string): Observable<OrderedItem[]> {
    // Check if the data is already in the cache
    if (this.orderItemCache[userId]) {
      return new Observable(observer => {
        observer.next(this.orderItemCache[userId]);
        observer.complete();
      });
    }

    // If not in the cache, make the actual request
    return this.getOrders(userId).pipe(
      map((orders: OrderDTO[]) => {
        const orderedItems: OrderedItem[] = [];
        orders.forEach(order => {
          if (order?.purchaseSummary) {
            try {
              const purchaseSummaryObject = JSON.parse(order.purchaseSummary);
              // Extract items from the cartSummary
              const itemsArray = purchaseSummaryObject.cartSummary?.items;
              if (itemsArray && Array.isArray(itemsArray)) {
                itemsArray.forEach(item => {
                  console.log("item: " + JSON.stringify(order));
                  const orderedItem: OrderedItem = {
                    orderId: order.id,
                    id: item.itemId,
                    itemName: item.name,
                    price: item.price?.amount,
                    Image: '',
                    creationDate: new Date(order?.creationDate),
                    shipmentStatus: order?.dispatchSummary?.shipmentStatus,
                    variationId: item?.variationId !== null?item?.variationId:null
                  };
                  orderedItems.push(orderedItem);
                });
              }
            } catch (e) {
              console.error('Error parsing purchaseSummary:', e);
              // Handle parsing error as needed
            }
          }
        });

        // Cache the result
        this.orderItemCache[userId] = orderedItems;
        return orderedItems;
      })
    );
  }

  getOrdersById(orderId: number): Observable<OrderDTO[]> {
    const url = `${this.apiUrl}/${orderId}`;
    return this.http.get<OrderDTO[]>(url);
  }

  getAdminOrders(pageNumber: number, count: number): Observable<HttpResponse<OrderDTO[]>> {
    const url = `${this.apiUrl}?page=${pageNumber}&size=${count}`;
    return this.http.get<OrderDTO[]>(url, { observe: 'response' });
  }

}
