import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToyService } from '../shared-services/toy.service';
import { Toy } from '../shared-services/toy';
import { StockService } from '../shared-services/stock.service';
import { Stock, StockStatus, ItemStock } from '../shared-services/stock';

@Injectable({
  providedIn: 'root'
})
export class ProductIntegrationService {
  private backendProducts$: BehaviorSubject<Toy[]> = new BehaviorSubject<Toy[]>([]);
  private productsLoaded: boolean = false;

  constructor(
    private toyService: ToyService,
    private stockService: StockService
  ) {
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

  /**
   * Check stock for a specific product by item ID
   */
  checkStockForProduct(itemId: number): Observable<ItemStock | null> {
    return new Observable(observer => {
      this.stockService.getAllStocks().subscribe({
        next: (stocks: Stock[]) => {
          // Filter stocks for the specific item ID
          const itemStocks = stocks.filter(stock => stock.itemId === itemId);
          
          if (itemStocks.length === 0) {
            observer.next(null);
            observer.complete();
            return;
          }

          // Get item stock summary using the existing method
          const itemStockArray = this.stockService.getItemStock(itemStocks);
          const itemStock = itemStockArray.find(item => item.itemId === itemId);
          
          observer.next(itemStock || null);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ [ProductIntegrationService] Error checking stock for item ID:', itemId, error);
          observer.next(null);
          observer.complete();
        }
      });
    });
  }

  /**
   * Check stock for a product using backend product
   */
  checkStockForBackendProduct(backendProduct: Toy): Observable<ItemStock | null> {
    if (!backendProduct || !backendProduct.id) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return this.checkStockForProduct(backendProduct.id);
  }

  /**
   * Get available stock count for a product
   */
  getAvailableStockCount(itemId: number): Observable<number> {
    return new Observable(observer => {
      this.checkStockForProduct(itemId).subscribe({
        next: (itemStock) => {
          if (itemStock) {
            // Available stock = ready + active - locked - addedToCart
            const availableStock = itemStock.ready + itemStock.active - itemStock.locked - itemStock.addedToCart;
            observer.next(Math.max(0, availableStock));
          } else {
            observer.next(0);
          }
          observer.complete();
        },
        error: (error) => {
          console.error('❌ [ProductIntegrationService] Error getting available stock count:', error);
          observer.next(0);
          observer.complete();
        }
      });
    });
  }

  /**
   * Check if product is in stock
   */
  isProductInStock(itemId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAvailableStockCount(itemId).subscribe({
        next: (availableStock) => {
          observer.next(availableStock > 0);
          observer.complete();
        },
        error: (error) => {
          console.error('❌ [ProductIntegrationService] Error checking if product is in stock:', error);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
} 