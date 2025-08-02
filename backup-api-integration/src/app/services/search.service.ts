import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toy } from './toy';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = environment.serviceURL + 'search'; 

  searchResultsBehavior :BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  searchResult$ = this.searchResultsBehavior.asObservable();

  public updateSearchResult(toys : Toy[])
  {
    this.searchResultsBehavior.next(toys);
  }

  public getSearchResultsObj()
  {
    return this.searchResult$;
  }

  constructor(private http: HttpClient) { }

  searchToys(query: string): Observable<Toy[]> {
    return this.http.get<Toy[]>(`${this.apiUrl}?q=${query}`);
  }

  getTopSearchKeywords(keyword: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/top-keywords?keyword=${keyword}`);
  }

}