import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { ProductService, Product } from '../../services/product.service';

interface Category {
  id: string; // Changed to string to match Product.category
  name: string;
  description: string;
  productCount: number;
  image?: string;
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.scss'
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  // Categories from ProductService
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';
  
  // Product data
  products: Product[] = [];
  private subscriptions: Subscription[] = [];
  
  // Loading states
  isLoading = false;

  // Pagination properties
  tableSize = 10;
  page = 1;
  count = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadCategoriesFromProductService();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCategoriesFromProductService(): void {
    this.isLoading = true;
    
    // Get categories and products from ProductService
    const categoriesAndProducts$ = forkJoin({
      categories: this.productService.getCategories(),
      products: this.productService.getAllProducts()
    });
    
    const sub = categoriesAndProducts$.subscribe({
      next: ({ categories, products }) => {
        console.log('📦 [AdminCategories] Loaded categories:', categories);
        console.log('📦 [AdminCategories] Loaded products:', products);
        
        this.products = products;
        this.buildCategoriesFromData(categories, products);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminCategories] Error loading categories:', error);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(sub);
  }

  buildCategoriesFromData(categoryIds: string[], products: Product[]): void {
    console.log('🔄 [AdminCategories] Building categories from ProductService data...');
    
    const categories: Category[] = [];
    
    categoryIds.forEach((categoryId, index) => {
      // Get products in this category
      const productsInCategory = products.filter(p => p.category === categoryId);
      
      // Get category name from first product
      const categoryName = productsInCategory.length > 0 ? productsInCategory[0].categoryName : categoryId;
      
      // Build category object
      const category: Category = {
        id: categoryId,
        name: categoryName,
        description: this.generateCategoryDescription(categoryName),
        productCount: productsInCategory.length,
        image: productsInCategory.length > 0 ? productsInCategory[0].image : undefined
      };
      
      categories.push(category);
    });
    
    // Sort by name
    this.categories = categories.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('📊 [AdminCategories] Built categories:', this.categories);
    this.applyFilters();
  }

  generateCategoryDescription(categoryName: string): string {
    // Generate smart descriptions based on category names
    const descriptions: { [key: string]: string } = {
      'crystalizer': 'Marble polish and crystallization products',
      'crystallizer': 'Marble polish and crystallization products',
      'epoxy': 'Professional epoxy solutions and grout',
      'cleaner': 'Stone and marble cleaning products',
      'cleaners': 'Stone and marble cleaning products',
      'sealer': 'Natural stone sealing and protection',
      'sealers': 'Natural stone sealing and protection',
      'mastic': 'High-performance mastic solutions',
      'densifier': 'Marble densification products',
      'grout': 'Professional grout solutions',
      'polish': 'Polishing and finishing products',
      'adhesive': 'Bonding and adhesive solutions'
    };
    
    const lowerName = categoryName.toLowerCase();
    
    // Find matching description
    for (const [key, desc] of Object.entries(descriptions)) {
      if (lowerName.includes(key)) {
        return desc;
      }
    }
    
    // Default description
    return `${categoryName} products and solutions`;
  }



  applyFilters(): void {
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           category.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    this.count = this.filteredCategories.length;
  }

  filterData(): void {
    this.applyFilters();
  }

  getParentCategory(category: Category): string {
    // Hardcoded to Stone Solutions for now
    return 'Stone Solutions';
  }

  refreshCategories(): void {
    this.loadCategoriesFromProductService();
  }
}