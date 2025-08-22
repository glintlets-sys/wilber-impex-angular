import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProductService, Product } from '../services/product.service';
import { CartIntegrationService } from '../services/cart-integration.service';
import { ProductIntegrationService } from '../services/product-integration.service';

interface Category {
  id: string;
  name: string;
  link: string;
  active: boolean;
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  currentCategory: string = 'cementitious-tile-adhesive';
  currentCategoryName: string = 'Cementitious Tile Adhesive';
  loading = true;
  addedToCartItems: Set<string> = new Set();
  
  // Stock checking properties
  stockInfo: { [productId: string]: any } = {};
  availableStock: { [productId: string]: number } = {};
  isInStock: { [productId: string]: boolean } = {};
  stockLoading: { [productId: string]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartIntegrationService: CartIntegrationService,
    private productIntegrationService: ProductIntegrationService
  ) {}

  ngOnInit() {
    this.initializeCategories();
    
    // Get category from route parameters
    this.route.params.subscribe(params => {
      const categoryParam = params['category'];
      if (categoryParam) {
        this.currentCategory = this.mapRouteToCategory(categoryParam);
        this.loadProductsForCategory(this.currentCategory);
      } else {
        this.loadProductsForCategory(this.currentCategory);
      }
    });
  }

  private mapRouteToCategory(routeParam: string): string {
    const routeMap: { [key: string]: string } = {
      'cementitious-tile-adhesive': 'cementitious-tile-adhesive',
      'epoxy-grout': 'epoxy-grout',
      'sealers': 'sealers',
      'cleaners': 'cleaners',
      'mastic': 'mastic',
      'epoxy-products': 'epoxy-products',
      'ager-polish': 'ager-polish',
      'lapizo-bond': 'lapizo-bond',
      'marble-densifier': 'marble-densifier',
      'crystalizer': 'crystalizer'
    };
    return routeMap[routeParam] || 'cementitious-tile-adhesive';
  }

  initializeCategories() {
    this.categories = [
      {
        id: 'cementitious-tile-adhesive',
        name: 'Cementitious Tile Adhesive',
        link: '/stone-solution/cementitious-tile-adhesive',
        active: true
      },
      {
        id: 'ager-polish',
        name: 'Ager / Polish',
        link: '/stone-solution/ager-polish',
        active: false
      },
      {
        id: 'epoxy-grout',
        name: 'Epoxy Grout',
        link: '/stone-solution/epoxy-grout',
        active: false
      },
      {
        id: 'sealers',
        name: 'Sealers',
        link: '/stone-solution/sealers',
        active: false
      },
      {
        id: 'cleaners',
        name: 'Cleaners',
        link: '/stone-solution/cleaners',
        active: false
      },
      {
        id: 'mastic',
        name: 'Mastic',
        link: '/stone-solution/mastic',
        active: false
      },
      {
        id: 'epoxy-products',
        name: 'Epoxy Products',
        link: '/stone-solution/epoxy-products',
        active: false
      },
      {
        id: 'lapizo-bond',
        name: 'Lapizo Bond',
        link: '/stone-solution/lapizo-bond',
        active: false
      },
      {
        id: 'crystalizer',
        name: 'Crystalizer',
        link: '/stone-solution/crystalizer',
        active: false
      },
      {
        id: 'marble-densifier',
        name: 'Marble Densifier',
        link: '/stone-solution/marble-densifier',
        active: false
      }
    ];
  }

  loadProductsForCategory(categoryId: string) {
    this.loading = true;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.currentCategory = categoryId;
        
        // Update category name
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
          this.currentCategoryName = category.name;
        }
        
        // Update active state
        this.categories.forEach(cat => cat.active = cat.id === categoryId);
        
        // Check stock for each product
        this.checkStockForProducts();
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
      }
    });
  }

  private checkStockForProducts(): void {
    this.products.forEach(product => {
      this.checkProductStock(product);
    });
  }

  private checkProductStock(product: Product): void {
    this.stockLoading[product.id] = true;
    
    // Map frontend product to backend product
    this.productIntegrationService.mapFrontendToBackendProduct(product).subscribe({
      next: (backendProduct) => {
        if (backendProduct) {
                     // First check if the product is active/available
           if (backendProduct.notAvailable === false) {
             console.log('🚫 [CategoryDetailComponent] Product is marked as not available:', {
               productId: backendProduct.id,
               productName: backendProduct.name,
               notAvailable: backendProduct.notAvailable
             });
             this.availableStock[product.id] = 0;
             this.isInStock[product.id] = false;
             this.stockLoading[product.id] = false;
             return;
           }

          // Check stock for the backend product
          this.productIntegrationService.checkStockForBackendProduct(backendProduct).subscribe({
            next: (stockInfo) => {
              this.stockInfo[product.id] = stockInfo;
              
              if (stockInfo) {
                // Calculate available stock
                this.availableStock[product.id] = stockInfo.ready + stockInfo.active - stockInfo.locked - stockInfo.addedToCart;
                this.availableStock[product.id] = Math.max(0, this.availableStock[product.id]);
                this.isInStock[product.id] = this.availableStock[product.id] > 0;
              } else {
                this.availableStock[product.id] = 0;
                this.isInStock[product.id] = false;
              }
              
              this.stockLoading[product.id] = false;
            },
            error: (error) => {
              console.error('Error checking stock for product:', product.name, error);
              this.availableStock[product.id] = 0;
              this.isInStock[product.id] = false;
              this.stockLoading[product.id] = false;
            }
          });
        } else {
          // No backend product found
          this.availableStock[product.id] = 0;
          this.isInStock[product.id] = false;
          this.stockLoading[product.id] = false;
        }
      },
      error: (error) => {
        console.error('Error mapping product to backend:', product.name, error);
        this.availableStock[product.id] = 0;
        this.isInStock[product.id] = false;
        this.stockLoading[product.id] = false;
      }
    });
  }

  onCategoryClick(categoryId: string) {
    // Navigate to the category route
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      this.router.navigate([category.link]);
    }
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(0);
    }
    
    return stars;
  }

  addToCart(product: Product) {
    // Use the cart integration service which handles stock validation
    this.cartIntegrationService.addToCart(product, 1, '', '', product.packagingType || 'Polythene Bag');
    
    // Mark as added to cart
    this.addedToCartItems.add(product.id);
    
    // Reset after 3 seconds
    setTimeout(() => {
      this.addedToCartItems.delete(product.id);
    }, 3000);
  }

  getAddToCartButtonText(product: Product): string {
    if (this.stockLoading[product.id]) {
      return 'Checking Stock...';
    }
    
    if (this.addedToCartItems.has(product.id)) {
      return 'Added to Cart';
    }
    
    if (!this.isInStock[product.id]) {
      return 'Out of Stock';
    }
    
    return 'Add To Cart';
  }

  getAddToCartButtonClass(product: Product): string {
    if (this.stockLoading[product.id]) {
      return 'add-to-cart loading';
    }
    
    if (this.addedToCartItems.has(product.id)) {
      return 'add-to-cart added';
    }
    
    if (!this.isInStock[product.id]) {
      return 'add-to-cart disabled';
    }
    
    return 'add-to-cart';
  }

  isAddToCartDisabled(product: Product): boolean {
    return this.stockLoading[product.id] || !this.isInStock[product.id] || this.addedToCartItems.has(product.id);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
