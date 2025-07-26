import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ProductService, Product } from '../services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = true;
        this.loading = false;
      }
    });

    // Initialize quantity controls and other functionality after view init
    setTimeout(() => {
      this.initializeProductFunctionality();
    }, 100);
  }

  loadProduct(productId: string) {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.loadRelatedProducts(product.category, product.id);
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
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