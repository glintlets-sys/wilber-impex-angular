import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Toy } from './toy';
import { ItemRecommendation } from './item-recommendation';
import { environment } from 'src/environments/environment';
import { ToyService } from './toy.service';


@Injectable({
  providedIn: 'root'
})
export class ItemRecommendationService {


  private itemRecommendationsBehavior: BehaviorSubject<ItemRecommendation[]> = new BehaviorSubject<ItemRecommendation[]>([]);
  private itemRecommendationsObservable$ = this.itemRecommendationsBehavior.asObservable();

  private relatedItemsCache = new Map<string, Toy[]>();


  private apiUrl = environment.serviceURL + 'item-recommendations'; // URL to web api

  constructor(private http: HttpClient,
    private toyService: ToyService) { }


  getAllRelatedItems(itemId: number, recommendationType: string): Observable<Toy[]> {
    const cacheKey = `${itemId}-${recommendationType}`;
    const cachedData = this.relatedItemsCache.get(cacheKey);

    if (cachedData) {
      return of(cachedData);
    } else {
      return this.http.get<Toy[]>(`${this.apiUrl}/${itemId}/related-items/${recommendationType}`).pipe(
        tap(data => this.relatedItemsCache.set(cacheKey, data))
      );
    }
  }

  updateOrAddRelatedItems(recommendation: ItemRecommendation): Observable<ItemRecommendation> {
    // Invalidate cache when updating items
    this.relatedItemsCache.clear();
    return this.http.post<ItemRecommendation>(this.apiUrl, recommendation);
  }

  // getAllRelatedItems(itemId: number, recommendationType: string): Observable<Toy[]> {
  //    return this.http.get<Toy[]>(`${this.apiUrl}/${itemId}/related-items/${recommendationType}`);
  // }

  //  updateOrAddRelatedItems(recommendation: ItemRecommendation): Observable<ItemRecommendation> {
  //    return this.http.post<ItemRecommendation>(this.apiUrl, recommendation);
  //  }

  getAllRecommendations(): Observable<ItemRecommendation[]> {

    return this.itemRecommendationsObservable$

  }

  loadRecommendations() {
    this.http.get<ItemRecommendation[]>(`${this.apiUrl}`).subscribe(val => {
      this.updateToyIds(val);
      this.itemRecommendationsBehavior.next(val);
    });
  }


  updateToyIds(val: ItemRecommendation[]) {
    for (let i = 0; i < val.length; i++) {
      try {
        val[i].item = this.toyService.getToyByIdNonObj(val[i].sourceItemId);
      } catch (error) {
        console.error('Error fetching toy for recommendation:', error);
      }
    }
  }

  deleteRecommendItem(itemRecommenid: number): Observable<void> {
    const url = `${this.apiUrl}/${itemRecommenid}`;
    return this.http.delete<void>(url);
  }


}



