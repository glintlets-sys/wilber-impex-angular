import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from './rating';
import { ItemRatings } from './item-ratings';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl: string = environment.serviceURL;  // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  addRatingAndComment(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.baseUrl}ratings/add`, rating);
  }

  getBulkRatingsAndComments(toyIds: number[]): Observable<Map<number, ItemRatings>> {
    return this.http.post<Map<number, ItemRatings>>(`${this.baseUrl}ratings/bulk`, toyIds);
  }

  getCommentsByToyId(toyId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.baseUrl}ratings/comments/${toyId}`);
  }


  private ratingMap: Map<number, BehaviorSubject<ItemRatings>> = new Map<number, BehaviorSubject<ItemRatings>>();


  getItemRating(itemId: number): BehaviorSubject<ItemRatings> {
    if ( !this.ratingMap.has(itemId)) {
        this.ratingMap.set(itemId, new BehaviorSubject<ItemRatings>({"averageRating":0 , "totalRatings":0}));
    }
    return this.ratingMap.get(itemId);
  }

 
  fetchItemRating(itemId: number) {
    this.getBulkRatingsAndComments([itemId]).subscribe(
      (itemRatings) => {
        const ratingCountSubject = this.ratingMap.get(itemId);
        if (ratingCountSubject) {
          ratingCountSubject.next(itemRatings[itemId]);
        }
    },
    (error) => {
        console.error('Error fetching stock count:', error);
    });
  } 

  addRatingAndCommentsForDeliveredProduct(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.baseUrl}ratings`, rating);
  }

}
