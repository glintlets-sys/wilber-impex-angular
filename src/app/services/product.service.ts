import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  image: string;
  link: string;
  rating: number;
  reviews?: number;
  badge?: string;
  size: string[];
  sizePrices?: { [key: string]: string };
  colors: string[];
  packagingType: string;
  price: string;
  category: string;
  categoryName: string;
  specifications?: string[];
  features?: string[];
  applications?: string[];
  considerations?: string[];
  howToApply?: {
    step: number;
    title: string;
    icon: string;
  }[];
  videoUrl?: string;
  applicationImage?: string;
}

interface ProductsResponse {
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) { }

  private loadProducts(): Observable<Product[]> {
    if (this.dataLoaded) {
      return of(this.products);
    }

    return this.http.get<ProductsResponse>('assets/data/products.json').pipe(
      map(response => {
        this.products = response.products;
        this.dataLoaded = true;
        return this.products;
      }),
      catchError(error => {
        console.error('Error loading products:', error);
        // Fallback to empty array if JSON loading fails
        return of([]);
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.loadProducts();
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.loadProducts().pipe(
      map(products => products.find(p => p.id === id))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.loadProducts().pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  getRelatedProducts(category: string, excludeProductId?: string): Observable<Product[]> {
    return this.loadProducts().pipe(
      map(products => {
        // First, try to get products from the same category
        let relatedProducts = products.filter(p => p.category === category);

        // Exclude the current product
        if (excludeProductId) {
          relatedProducts = relatedProducts.filter(p => p.id !== excludeProductId);
        }

        // If we have enough products from the same category, return them
        if (relatedProducts.length >= 4) {
          return relatedProducts.slice(0, 4);
        }

        // If we don't have enough products from the same category, 
        // add some featured products to fill the gap
        if (relatedProducts.length < 4) {
          const featuredProducts = products.filter(p => 
            p.badge === 'New' || p.badge === 'Bestseller' || p.badge === 'Premium'
          ).filter(p => p.id !== excludeProductId);
          
          // Add featured products that are not already in related products
          const existingIds = relatedProducts.map(p => p.id);
          const additionalProducts = featuredProducts.filter(p => !existingIds.includes(p.id));
          
          relatedProducts = [...relatedProducts, ...additionalProducts];
        }

        // Return max 4 related products
        return relatedProducts.slice(0, 4);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.loadProducts().pipe(
      map(products => [...new Set(products.map(p => p.category))])
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.loadProducts().pipe(
      map(products => {
        const searchTerm = query.toLowerCase();
        return products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.categoryName.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  getProductsByBadge(badge: string): Observable<Product[]> {
    return this.loadProducts().pipe(
      map(products => products.filter(p => p.badge === badge))
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.loadProducts().pipe(
      map(products => products.filter(p => p.badge === 'New' || p.badge === 'Bestseller' || p.badge === 'Premium'))
    );
  }
} 