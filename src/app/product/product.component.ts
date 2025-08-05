import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ProductIntegrationService } from '../services/product-integration.service';
import { Toy } from '../shared-services/toy';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  backendProduct: Toy | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error = false;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedPackaging: string = '';
  quantity: number = 1;
  isAddedToCart = false;
  
  // Stock checking properties
  stockInfo: any = null;
  availableStock: number = 0;
  isInStock: boolean = false;
  stockLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private productIntegrationService: ProductIntegrationService
  ) {}

  ngOnInit() {
    // First, load backend products to see what's available
    this.productIntegrationService.getBackendProducts().subscribe(backendProducts => {
      // Now load the specific product
      this.route.params.subscribe(params => {
        const productId = params['id'];
        if (productId) {
          this.loadProduct(productId);
        } else {
          console.error('❌ [ProductComponent] No product ID provided');
          this.error = true;
          this.loading = false;
        }
      });
    });

    // Initialize quantity controls and other functionality after view init
    setTimeout(() => {
      this.initializeProductFunctionality();
    }, 100);
  }

  loadProduct(productId: string) {
    // Load frontend product (static from CDN)
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loadRelatedProducts(product.category, product.id);
          
          // Map frontend product to backend product using code
          this.productIntegrationService.mapFrontendToBackendProduct(product).subscribe({
            next: (backendProduct) => {
              if (backendProduct) {
                this.backendProduct = backendProduct;
                // Check stock for the backend product
                this.checkProductStock();
              } else {
                console.warn('⚠️ [ProductComponent] No backend product found for frontend product:', product.name);
                this.backendProduct = null;
                this.isInStock = false;
                this.availableStock = 0;
              }
            },
            error: (error) => {
              console.error('❌ [ProductComponent] Error mapping to backend product:', error);
              this.backendProduct = null;
              this.isInStock = false;
              this.availableStock = 0;
            }
          });
        } else {
          console.error('❌ [ProductComponent] Frontend product not found');
          this.error = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [ProductComponent] Error loading frontend product:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(category: string, excludeProductId?: string) {
    this.productService.getRelatedProducts(category, excludeProductId).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
        this.relatedProducts = [];
      }
    });
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

  navigateToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/stone-solution', category]);
  }

  addToCart(): void {
    if (!this.product) return;

    // Check if product is in stock before adding to cart
    if (this.backendProduct && !this.isInStock) {
      console.warn('⚠️ [ProductComponent] Cannot add to cart - product is out of stock');
      // You can show a toast notification here
      return;
    }

    // Check if requested quantity is available
    if (this.backendProduct && this.availableStock > 0 && this.quantity > this.availableStock) {
      console.warn('⚠️ [ProductComponent] Requested quantity exceeds available stock');
      // You can show a toast notification here
      return;
    }

    // Get selected variations
    const size = this.selectedSize || (this.product.size.length > 0 ? this.product.size[0] : undefined);
    const color = this.selectedColor || (this.product.colors.length > 0 ? this.product.colors[0] : undefined);
    const packaging = this.selectedPackaging || this.product.packagingType || 'Polythene Bag';

    // Get selected price based on size if available
    let selectedPrice = this.product.price;
    if (this.product.sizePrices && size) {
      selectedPrice = this.product.sizePrices[size] || this.product.price;
    }

    this.cartService.addToCart(
      this.product,
      this.quantity,
      size,
      color,
      packaging,
      selectedPrice
    );

    // Set added to cart state
    this.isAddedToCart = true;
    
    // Reset after 3 seconds
    setTimeout(() => {
      this.isAddedToCart = false;
    }, 3000);

    // Show success message (you can implement a toast notification here)
    console.log('Product added to cart successfully!');
  }

  updateQuantity(change: number): void {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1) {
      // Check if the new quantity doesn't exceed available stock
      if (this.backendProduct && this.availableStock > 0 && newQuantity > this.availableStock) {
        console.warn('⚠️ [ProductComponent] Cannot increase quantity - exceeds available stock');
        return;
      }
      this.quantity = newQuantity;
    }
  }

  toggleProductInfo(sectionId: string) {
    const productInfoContents = document.querySelectorAll('.product-info-content');
    const targetSection = document.getElementById('product-info-' + sectionId);
    
    // Hide all sections
    productInfoContents.forEach((content: any) => {
      content.style.display = 'none';
    });
    
    // Show the selected section if it exists
    if (targetSection) {
      if (targetSection.style.display === 'block') {
        targetSection.style.display = 'none';
      } else {
        targetSection.style.display = 'block';
      }
    }
  }

  /**
   * Check if backend product is available for this frontend product
   */
  isBackendProductAvailable(): boolean {
    return this.backendProduct !== null;
  }

  /**
   * Get backend product details for logging
   */
  getBackendProductDetails(): any {
    if (!this.backendProduct) {
      return null;
    }
    
    return {
      id: this.backendProduct.id,
      name: this.backendProduct.name,
      price: this.backendProduct.price,
      stockType: this.backendProduct.stockType,
      notAvailable: this.backendProduct.notAvailable,
      categories: this.backendProduct.categories,
      brand: this.backendProduct.brand,
      summary: this.backendProduct.summary
    };
  }

  /**
   * Log integration status
   */
  logIntegrationStatus(): void {
    // Removed verbose logging - only keep essential warnings/errors
  }

  /**
   * Check stock for the current product
   */
  checkProductStock(): void {
    if (!this.backendProduct) {
      console.warn('⚠️ [ProductComponent] No backend product available for stock check');
      this.isInStock = false;
      this.availableStock = 0;
      return;
    }

    this.stockLoading = true;
    
    // Check stock using the integration service
    this.productIntegrationService.checkStockForBackendProduct(this.backendProduct).subscribe({
      next: (stockInfo) => {
        this.stockInfo = stockInfo;
        
        if (stockInfo) {
          // Calculate available stock
          this.availableStock = stockInfo.ready + stockInfo.active - stockInfo.locked - stockInfo.addedToCart;
          this.availableStock = Math.max(0, this.availableStock);
          this.isInStock = this.availableStock > 0;
          
          console.log('✅ [ProductComponent] Stock check completed:', {
            productId: this.backendProduct?.id,
            productName: this.backendProduct?.name,
            stockInfo: stockInfo,
            availableStock: this.availableStock,
            isInStock: this.isInStock
          });
        } else {
          this.availableStock = 0;
          this.isInStock = false;
          console.warn('⚠️ [ProductComponent] No stock information found for product:', this.backendProduct?.name);
        }
        
        this.stockLoading = false;
      },
      error: (error) => {
        console.error('❌ [ProductComponent] Error checking stock:', error);
        this.availableStock = 0;
        this.isInStock = false;
        this.stockLoading = false;
      }
    });
  }

  /**
   * Get stock status text
   */
  getStockStatusText(): string {
    if (this.stockLoading) {
      return 'Checking stock...';
    }
    
    if (!this.backendProduct) {
      return 'Stock information not available';
    }
    
    if (this.isInStock) {
      return `In Stock (${this.availableStock} available)`;
    } else {
      return 'Out of Stock';
    }
  }

  /**
   * Get stock status CSS class
   */
  getStockStatusClass(): string {
    if (this.stockLoading) {
      return 'stock-loading';
    }
    
    if (!this.backendProduct) {
      return 'stock-unavailable';
    }
    
    return this.isInStock ? 'stock-available' : 'stock-unavailable';
  }

  private initializeProductFunctionality() {
    // Quantity controls
    const increaseBtn = document.getElementById('increase-qty');
    const decreaseBtn = document.getElementById('decrease-qty');
    const quantityInput = document.getElementById('quantity') as HTMLInputElement;

    if (increaseBtn && quantityInput) {
      increaseBtn.addEventListener('click', () => {
        quantityInput.value = (parseInt(quantityInput.value) + 1).toString();
      });
    }

    if (decreaseBtn && quantityInput) {
      decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = (currentValue - 1).toString();
        }
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener('change', () => {
        if (parseInt(quantityInput.value) < 1 || isNaN(parseInt(quantityInput.value))) {
          quantityInput.value = '1';
        } else {
          quantityInput.value = parseInt(quantityInput.value).toString();
        }
      });
    }

    // Read more functionality
    const readMoreBtn = document.getElementById('read-more-btn');
    const moreDescription = document.getElementById('more-description');
    
    if (readMoreBtn && moreDescription) {
      readMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (moreDescription.style.display === 'none') {
          moreDescription.style.display = 'block';
          readMoreBtn.textContent = 'Read less';
        } else {
          moreDescription.style.display = 'none';
          readMoreBtn.textContent = 'Read more';
        }
      });
    }

    // Thumbnail functionality
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainProductImage') as HTMLImageElement;
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
        
        // Update main image
        const imageSrc = thumbnail.getAttribute('data-src');
        if (imageSrc && mainImage) {
          mainImage.src = imageSrc;
        }
      });
    });
  }
} 