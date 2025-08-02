import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { Breadcrumb, Category } from './category';
import { environment } from 'src/environments/environment';
import { Toy } from './toy';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.serviceURL + 'categories'; // Replace with your API endpoint URL
  public categoriesShowcaseSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesShowcaseSubject.asObservable();



  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  public loadCategories(): void {
    //TODO modify this to get data for showcase than all. 
    this.http.get<Category[]>(this.apiUrl).subscribe(categories => {
      categories.forEach(category => {
        category.breadcrumb = this.calculateBreadcrumb(category.id, categories);
      });
      this.categoriesShowcaseSubject.next(categories);
    });
  }

  private calculateBreadcrumb(categoryId: number, categories: Category[]): Breadcrumb[] {
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      return [];
    }
    
    // Base case for recursion: root category (no parent)
    if (category.parentId == null) {
      return [{ id: category.id, name: category.name }];
    }
    
    // Recursively build the breadcrumb path
    return [...this.calculateBreadcrumb(category.parentId, categories), { id: category.id, name: category.name }];
  }

  /******** */
  private apiToyURL = environment.serviceURL + 'toys'; // Replace with your API endpoint URL

  addCategoriesToToy(toyId: number, categories: number[]): Observable<Toy> {
    const url = `${this.apiToyURL}/${toyId}/categories`;
    return this.http.post<Toy>(url, categories);
  }

  deleteCategoriesFromToy(toyId: number, categories: number[]): Observable<Toy> {
    const url = `${this.apiToyURL}/${toyId}/categories`;
    return this.http.delete<Toy>(url, { body: categories });
  }

  deleteCategoryFromToy(toyId: number, categoryId: number): Observable<Toy> {
    const url = `${this.apiToyURL}/${toyId}/categories/${categoryId}`;
    return this.http.delete<Toy>(url);
  }
  /******** */

  getToysByCategoryId(categoryId: number): Observable<Toy[]> {
    const url = `${this.apiUrl}/${categoryId}/toys`;
    return this.http.get<Toy[]>(url);
  }

    // Cache for toys data: stores categoryId mapped to BehaviorSubject for caching items
    private toyCache = new Map<number, BehaviorSubject<Toy[]>>();


    getToysByCategoryIdPaginated(categoryId: number, page: number, size: number): Observable<Toy[]> {
      const url = `${this.apiUrl}/${categoryId}/toysPaginated?page=${page}&size=${size}`; // Modify this according to your API
      return this.http.get<Toy[]>(url);
    }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getAllShowCaseCategories(): Observable<Category[]> {
    if (this.categoriesShowcaseSubject.getValue() === null) {
      this.loadCategories();
    }
    return this.categoriesShowcaseSubject;
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateThumbnail(): Observable<any> {
    return this.http.get<any>(`${environment.serviceURL}inspector/update-thumbnails`);
  }
}
