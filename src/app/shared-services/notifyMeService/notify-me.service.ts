import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { NotifyMe } from '../Interface/notify-me';


@Injectable({
  providedIn: 'root'
})
export class NotifyMeService {
  private baseUrl = `${environment.serviceURL}`;
  private notificationSummaryCache: NotifyMe;
  private notifySent: Map<number, BehaviorSubject<number>> = new Map<number, BehaviorSubject<number>>();

  constructor(private http: HttpClient) { }

  captureNotification(itemId: number, customerId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}notifications/capture?itemId=${itemId}&customerId=${customerId}`, {});
  }

  getAllNotifications(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}notifications/all`);
  }

  getNotificationsForItem(itemId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}notifications/item/${itemId}`);
  }

  sendNotificationsForItem(itemId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}notifications/send/${itemId}`, {});
  }


  getNotificationSummary(): Observable<any> {
    if (this.notificationSummaryCache) {
      return of(this.notificationSummaryCache);
    } else {
      return this.http.get<any>(`${this.baseUrl}summary`).pipe(
        tap(summary => {
          this.notificationSummaryCache = summary;
        }),
        catchError(error => {
          return of(null);
        })
      );
    }
  }


  hasCapturedNotification(itemId: number, userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}notifications/captured?itemId=${itemId}&userId=${userId}`);
  }

  clearCache() {
    this.notificationSummaryCache = null;
  }


}
