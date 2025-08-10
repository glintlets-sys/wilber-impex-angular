import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToyService } from '../../shared-services/toy.service';
import { StockService } from '../../shared-services/stock.service';
import { Toy } from '../../shared-services/toy';
import { ItemStock } from '../../shared-services/stock';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  // Only backend products - simplified
  products: Toy[] = [];
  filteredProducts: Toy[] = [];
  stockData: ItemStock[] = [];
  
  // Search and filter
  searchTerm = '';
  selectedStatus = '';

  // Pagination properties
  tableSize = 10;
  page = 1;
  count = 0;
  
  // Loading states
  isLoading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private toyService: ToyService,
    private stockService: StockService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.loadBackendProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBackendProducts(): void {
    this.isLoading = true;
    
    // Load backend products
    const toysSub = this.toyService.getAllToysNonPaginated().subscribe({
      next: (toys) => {
        console.log('📦 [AdminProducts] Loaded backend products:', toys);
        console.log('📦 [AdminProducts] First product structure:', toys[0]);
        if (toys.length > 0) {
          console.log('📦 [AdminProducts] Product notAvailable field:', toys[0].notAvailable, 'Type:', typeof toys[0].notAvailable);
          console.log('📦 [AdminProducts] Mapped status:', this.getProductStatus(toys[0]));
        }
        this.products = toys;
        this.loadStockData();
      },
      error: (error) => {
        console.error('❌ [AdminProducts] Error loading backend products:', error);
        this.toasterService.showToast('Error loading products', ToastType.Error, 3000);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(toysSub);
  }

  loadStockData(): void {
    const stocksSub = this.stockService.getAllStocks().subscribe({
      next: (stocks) => {
        console.log('📊 [AdminProducts] Loaded stock data:', stocks);
        this.stockData = this.stockService.getItemStock(stocks);
        this.updateFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ [AdminProducts] Error loading stocks:', error);
        this.toasterService.showToast('Error loading stock data', ToastType.Error, 3000);
        this.updateFilters();
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(stocksSub);
  }

  updateFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const productName = this.getProductName(product);
      const matchesSearch = productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (product.code?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false) ||
                           (product.brand?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false);
      
      const productStatus = this.getProductStatus(product);
      const matchesStatus = this.selectedStatus === '' || 
                           productStatus.toLowerCase() === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    
    this.count = this.filteredProducts.length;
  }

  applyFilters(): void {
    this.updateFilters();
  }

  getStockForProduct(productId: number): ItemStock | undefined {
    return this.stockData.find(stock => stock.itemId === productId);
  }

  getStockDisplay(productId: number): string {
    const stock = this.getStockForProduct(productId);
    if (!stock) return 'No stock data';
    
    return `Total: ${stock.quantity} | In Cart: ${stock.addedToCart} | Active: ${stock.active}`;
  }

  getProductName(product: Toy): string {
    // Handle cases where name might be undefined or null
    return product.name || 'Unnamed Product';
  }

  getProductDescription(product: Toy): string {
    // Handle ProductDescription array
    if (product.productDescription && Array.isArray(product.productDescription) && product.productDescription.length > 0) {
      // Get the first description's text
      const firstDesc = product.productDescription[0];
      return firstDesc.text || firstDesc.heading || '';
    }
    // Try other fields for description
    if (product.summary) return product.summary;
    if (product.code) return `Product code: ${product.code}`;
    return ''; // Return empty string instead of showing fallback text
  }

  getProductThumbnail(product: Toy): string {
    // Handle thumbnail object or string
    if (product.thumbnail) {
      if (typeof product.thumbnail === 'string') {
        return product.thumbnail;
      } else if (product.thumbnail.url) {
        return product.thumbnail.url;
      } else if (product.thumbnail.src) {
        return product.thumbnail.src;
      }
    }
    
    // Fallback to photoLinks if available
    if (product.photoLinks && Array.isArray(product.photoLinks) && product.photoLinks.length > 0) {
      const firstPhoto = product.photoLinks[0];
      if (typeof firstPhoto === 'string') {
        return firstPhoto;
      } else if (firstPhoto.url) {
        return firstPhoto.url;
      }
    }
    
    return 'assets/images/placeholder-product.png';
  }

  getProductStatus(product: Toy): string {
    // Use notAvailable field to determine status
    // notAvailable = true means product is active (reversed logic)
    // notAvailable = false or undefined means product is inactive
    if (product.notAvailable === true) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  }

  getStatusClass(statusString: string): string {
    switch (statusString?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'inactive':
        return 'badge bg-secondary';
      default:
        return 'badge bg-warning';
    }
  }

  getStockStatusClass(productId: number): string {
    const stock = this.getStockForProduct(productId);
    if (!stock) return 'text-muted';
    
    if (stock.quantity === 0) return 'text-danger';
    if (stock.quantity < 10) return 'text-warning';
    return 'text-success';
  }

  refreshData(): void {
    this.loadBackendProducts();
  }

  viewProductDetails(product: Toy): void {
    const stock = this.getStockForProduct(product.id || 0);
    const stockInfo = stock ? 
      `Stock Details:\n- Total: ${stock.quantity}\n- In Cart: ${stock.addedToCart}\n- Active: ${stock.active}\n- Sold: ${stock.sold}` :
      'No stock information available';
    
    const productName = this.getProductName(product);
    const productDesc = this.getProductDescription(product);
    const productStatus = this.getProductStatus(product);
    
    alert(`Product Details:\n\nName: ${productName}\nCode: ${product.code || 'N/A'}\nBrand: ${product.brand || 'N/A'}\nPrice: ₹${product.price?.amount || 0}\nStatus: ${productStatus}\nDescription: ${productDesc || 'No description'}\n\n${stockInfo}`);
  }

  // Toggle product availability status
  toggleProductAvailability(product: Toy): void {
    const oldStatus = product.notAvailable;
    const newStatus = !oldStatus;
    // Reversed logic: true means active, false means inactive
    const statusText = newStatus ? 'active' : 'inactive';
    
    if (confirm(`Are you sure you want to make "${this.getProductName(product)}" ${statusText}?`)) {
      // Optimistically update the UI
      product.notAvailable = newStatus;
      
      // Update the backend
      const updateSub = this.toyService.updateToy(product).subscribe({
        next: (updatedProduct) => {
          console.log('✅ [AdminProducts] Product status updated successfully:', updatedProduct);
          this.toasterService.showToast(`Product marked as ${statusText}`, 'success' as any, 3000);
          // Update the product in our local array with the response
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.updateFilters();
          }
        },
        error: (error) => {
          console.error('❌ [AdminProducts] Error updating product status:', error);
          // Revert the optimistic update
          product.notAvailable = oldStatus;
          this.toasterService.showToast('Error updating product status', ToastType.Error, 3000);
        }
      });
      
      this.subscriptions.push(updateSub);
      this.updateFilters(); // Update the filtered view immediately
    }
  }

  // Placeholder methods for future implementation
  editProduct(product: Toy): void {
    console.log('Edit product:', product);
    // Implementation for editing products
  }

  deleteProduct(product: Toy): void {
    if (confirm(`Are you sure you want to delete "${this.getProductName(product)}"?`)) {
      console.log('Delete product:', product);
      // Implementation for deleting products
    }
  }

  addNewProduct(): void {
    console.log('Add new product');
    // Implementation for adding new products
  }

  exportProducts(): void {
    console.log('Export products');
    // Implementation for exporting products
  }

  importProducts(): void {
    console.log('Import products');
    // Implementation for importing products
  }
}