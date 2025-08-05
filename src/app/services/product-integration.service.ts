import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToyService } from '../shared-services/toy.service';
import { Toy } from '../shared-services/toy';

@Injectable({
  providedIn: 'root'
})
export class ProductIntegrationService {
  private backendProducts$: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  private productsLoaded: boolean = false;

  constructor(private toyService: ToyService) {
    this.loadBackendProducts();
  }

  /**
   * Load all products from backend and log them
   */
  private loadBackendProducts(): void {
    this.toyService.getAllToysNonPaginated().subscribe({
      next: (products: Toy[]) => {
        this.backendProducts$.next(products);
        this.productsLoaded = true;
      },
      error: (error) => {
        console.error('❌ [ProductIntegrationService] Error loading backend products:', error);
        this.backendProducts$.next([]);
      }
    });
  }

  /**
   * Get all backend products as observable
   */
  getBackendProducts(): Observable<Toy[]> {
    return this.backendProducts$.asObservable();
  }

  /**
   * Get a specific product by ID from backend
   */
  getBackendProductById(productId: number): Observable<Toy | undefined> {
    return new Observable(observer => {
      this.backendProducts$.subscribe(products => {
        const product = products.find(p => p.id === productId);
        observer.next(product);
        observer.complete();
      });
    });
  }

  /**
   * Get a specific product by code from backend
   */
  getBackendProductByCode(productCode: string): Observable<Toy | undefined> {
    return new Observable(observer => {
      this.backendProducts$.subscribe(products => {
        const product = products.find(p => p.code === productCode);
        observer.next(product);
        observer.complete();
      });
    });
  }

  /**
   * Map frontend product to backend product using code
   */
  mapFrontendToBackendProduct(frontendProduct: any): Observable<Toy | undefined> {
    return new Observable(observer => {
      this.backendProducts$.subscribe(backendProducts => {
        // Try to find by product code first
        let backendProduct = backendProducts.find(p => p.code === frontendProduct.id);
        
        if (!backendProduct) {
          // If not found by code, try by name (case insensitive)
          backendProduct = backendProducts.find(p => 
            p.name?.toLowerCase() === frontendProduct.name?.toLowerCase()
          );
        }
        
        if (!backendProduct) {
          // If still not found, try partial name match
          backendProduct = backendProducts.find(p => 
            p.name?.toLowerCase().includes(frontendProduct.name?.toLowerCase()) ||
            frontendProduct.name?.toLowerCase().includes(p.name?.toLowerCase())
          );
        }
        
        observer.next(backendProduct);
        observer.complete();
      });
    });
  }

  /**
   * Check if products are loaded
   */
  areProductsLoaded(): boolean {
    return this.productsLoaded;
  }


  /**
   * Refresh backend products
   */
  refreshBackendProducts(): void {
    this.productsLoaded = false;
    this.loadBackendProducts();
  }
} 