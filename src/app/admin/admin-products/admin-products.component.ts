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
    console.log('📤 [AdminProducts] Exporting products...');
    
    try {
      // Prepare data for export
      const exportData = this.products.map(product => {
        const stock = this.getStockForProduct(product.id || 0);
        return {
          id: product.id,
          name: this.getProductName(product),
          code: product.code || '',
          brand: product.brand || '',
          price: product.price?.amount || 0,
          description: this.getProductDescription(product),
          status: this.getProductStatus(product),
          stock: {
            total: stock?.quantity || 0,
            inCart: stock?.addedToCart || 0,
            active: stock?.active || 0,
            sold: stock?.sold || 0
          },
          thumbnail: this.getProductThumbnail(product),
          discount: product.discount?.discountPercent || 0,
          notAvailable: product.notAvailable
        };
      });

      // Create CSV content
      const headers = [
        'ID', 'Name', 'Code', 'Brand', 'Price', 'Description', 
        'Status', 'Stock Total', 'Stock In Cart', 'Stock Active', 
        'Stock Sold', 'Thumbnail', 'Discount %', 'Not Available'
      ];
      
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => [
          row.id,
          `"${row.name}"`,
          row.code,
          row.brand,
          row.price,
          `"${row.description}"`,
          row.status,
          row.stock.total,
          row.stock.inCart,
          row.stock.active,
          row.stock.sold,
          row.thumbnail,
          row.discount,
          row.notAvailable
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.toasterService.showToast(
        `Successfully exported ${exportData.length} products to CSV`, 
        ToastType.Success, 
        3000
      );
    } catch (error) {
      console.error('❌ [AdminProducts] Error exporting products:', error);
      this.toasterService.showToast('Error exporting products', ToastType.Error, 3000);
    }
  }

  importProducts(): void {
    console.log('📥 [AdminProducts] Importing products...');
    
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const content = e.target.result;
          this.processImportedFile(content, file.name);
        } catch (error) {
          console.error('❌ [AdminProducts] Error processing imported file:', error);
          this.toasterService.showToast('Error processing imported file', ToastType.Error, 3000);
        }
      };
      
      reader.readAsText(file);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  private processImportedFile(content: string, fileName: string): void {
    try {
      // Parse CSV content
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).filter(line => line.trim());
      
      console.log('📊 [AdminProducts] Imported data headers:', headers);
      console.log('📊 [AdminProducts] Imported data rows:', data.length);

      // Validate file structure
      const requiredHeaders = ['Name', 'Code', 'Price'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        this.toasterService.showToast(
          `Invalid file format. Missing required columns: ${missingHeaders.join(', ')}`, 
          ToastType.Error, 
          5000
        );
        return;
      }

      // Process each row
      const processedProducts = data.map((line, index) => {
        const values = this.parseCSVLine(line);
        const row: any = {};
        
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });

        return {
          name: row['Name'] || '',
          code: row['Code'] || '',
          brand: row['Brand'] || '',
          price: parseFloat(row['Price']) || 0,
          description: row['Description'] || '',
          status: row['Status'] || 'Active',
          thumbnail: row['Thumbnail'] || '',
          discount: parseFloat(row['Discount %']) || 0,
          notAvailable: row['Not Available'] === 'true' || row['Status'] === 'Inactive'
        };
      }).filter(product => product.name && product.code); // Filter out empty rows

      console.log('📊 [AdminProducts] Processed products:', processedProducts);

      if (processedProducts.length === 0) {
        this.toasterService.showToast('No valid products found in the file', ToastType.Warn, 3000);
        return;
      }

      // Show preview and confirmation
      this.showImportPreview(processedProducts, fileName);

    } catch (error) {
      console.error('❌ [AdminProducts] Error processing imported file:', error);
      this.toasterService.showToast('Error processing imported file', ToastType.Error, 3000);
    }
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private showImportPreview(products: any[], fileName: string): void {
    const previewHtml = `
      <div class="import-preview">
        <h5>Import Preview</h5>
        <p><strong>File:</strong> ${fileName}</p>
        <p><strong>Products to import:</strong> ${products.length}</p>
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${products.slice(0, 10).map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.code}</td>
                  <td>₹${p.price}</td>
                  <td>${p.status}</td>
                </tr>
              `).join('')}
              ${products.length > 10 ? `<tr><td colspan="4" class="text-center">... and ${products.length - 10} more</td></tr>` : ''}
            </tbody>
          </table>
        </div>
        <p><strong>Note:</strong> This will create new products. Existing products with the same code will be updated.</p>
      </div>
    `;

    if (confirm(`Import ${products.length} products from ${fileName}?\n\nThis will create/update products in the system.`)) {
      this.executeImport(products);
    }
  }

  private executeImport(products: any[]): void {
    console.log('🚀 [AdminProducts] Executing import for', products.length, 'products');
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process products in batches
    const batchSize = 5;
    const processBatch = (batch: any[], index: number) => {
      const promises = batch.map(product => {
        // Create new product object
        const newProduct: any = {
          name: product.name,
          code: product.code,
          brand: product.brand,
          price: {
            amount: product.price,
            currency: 'INR'
          },
          description: product.description,
          thumbnail: product.thumbnail,
          discount: product.discount > 0 ? {
            discountPercent: product.discount
          } : null,
          notAvailable: product.notAvailable
        };

        // Check if product exists (by code)
        const existingProduct = this.products.find(p => p.code === product.code);
        
        if (existingProduct) {
          // Update existing product
          const updatedProduct = { ...existingProduct, ...newProduct };
          return this.toyService.updateToy(updatedProduct).toPromise()
            .then(() => {
              successCount++;
              console.log('✅ [AdminProducts] Updated product:', product.code);
            })
            .catch(error => {
              errorCount++;
              errors.push(`Failed to update ${product.code}: ${error.message}`);
              console.error('❌ [AdminProducts] Error updating product:', product.code, error);
            });
        } else {
          // Create new product
          return this.toyService.createToy(newProduct).toPromise()
            .then(() => {
              successCount++;
              console.log('✅ [AdminProducts] Created product:', product.code);
            })
            .catch(error => {
              errorCount++;
              errors.push(`Failed to create ${product.code}: ${error.message}`);
              console.error('❌ [AdminProducts] Error creating product:', product.code, error);
            });
        }
      });

      return Promise.all(promises);
    };

    // Process all batches
    const batches = [];
    for (let i = 0; i < products.length; i += batchSize) {
      batches.push(products.slice(i, i + batchSize));
    }

    let processedBatches = 0;
    const processAllBatches = async () => {
      for (const batch of batches) {
        await processBatch(batch, processedBatches);
        processedBatches++;
        
        // Update progress
        const progress = Math.round((processedBatches / batches.length) * 100);
        this.toasterService.showToast(
          `Importing products... ${progress}% complete`, 
          ToastType.Info, 
          1000
        );
      }

      // Final result
      const message = `Import completed: ${successCount} successful, ${errorCount} failed`;
      this.toasterService.showToast(message, errorCount > 0 ? ToastType.Warn : ToastType.Success, 5000);
      
      if (errors.length > 0) {
        console.error('❌ [AdminProducts] Import errors:', errors);
      }

      // Refresh the product list
      this.refreshData();
    };

    processAllBatches();
  }
}