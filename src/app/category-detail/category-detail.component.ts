import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
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
    this.cartService.addToCart(product, 1, '', '', product.packagingType || 'Polythene Bag');
    
    // Mark as added to cart
    this.addedToCartItems.add(product.id);
    
    // Reset after 3 seconds
    setTimeout(() => {
      this.addedToCartItems.delete(product.id);
    }, 3000);
  }

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}
