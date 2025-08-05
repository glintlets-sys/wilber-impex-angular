import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartIntegrationService, LocalCartItem } from '../../services/cart-integration.service';
import { CatalogService } from '../../shared-services/catalog.service';
import { Toy } from '../../shared-services/toy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hover-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hover-cart.component.html',
  styleUrls: ['./hover-cart.component.scss']
})
export class HoverCartComponent implements OnInit, OnDestroy {
  cartItems: LocalCartItem[] = [];
  displayItems: LocalCartItem[] = [];
  displayItemTotals: { [key: number]: number } = {};
  totalItems = 0;
  totalPrice = 0;
  remainingItemsCount = 0;
  isOpen = false;
  private catalogItems: Toy[] = [];
  private fetchRequests = new Map<number, boolean>();
  private isCatalogLoading: boolean = false;
  private catalogLoaded: boolean = false;
  private cartSubscription: Subscription;

  constructor(
    private cartIntegrationService: CartIntegrationService,
    private catalogService: CatalogService
  ) {
    // Don't subscribe to cart updates in constructor to avoid infinite loops
  }

  ngOnInit(): void {
    // Load catalog data once when component initializes
    this.loadCatalogData();
    
    // Load cart data once when component initializes
    this.loadCartData();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.hover-cart-container')) {
      this.isOpen = false;
    }
  }

  toggleCart(): void {
    this.isOpen = !this.isOpen;
    
    // Refresh cart data when opening the hover cart
    if (this.isOpen) {
      this.refreshCartData();
    }
  }

  removeItem(itemIndex: number): void {
    this.cartIntegrationService.removeFromCart(itemIndex);
  }

  extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }

  private updateCartDisplay(cart: any): void {
    this.cartItems = cart.items;
    this.totalItems = cart.totalItems;
    this.totalPrice = cart.totalPrice;
    
    // Calculate display items (first 3) and remaining count
    this.displayItems = this.cartItems.slice(0, 3);
    this.remainingItemsCount = Math.max(0, this.cartItems.length - 3);
    
    // Pre-calculate item totals for display items
    this.displayItemTotals = {};
    this.displayItems.forEach((item, index) => {
      this.displayItemTotals[index] = this.extractPrice(item.product.price) * item.quantity;
    });
  }

  private loadCartData(): void {
    // Load cart data once without subscribing to updates
    this.cartSubscription = this.cartIntegrationService.getCart().subscribe(cart => {
      console.log('🛒 [HoverCartComponent] Initial cart load - Items:', cart.items.length, 'Total:', cart.totalPrice);
      this.updateCartDisplay(cart);
      // Unsubscribe immediately to prevent infinite loops
      if (this.cartSubscription) {
        this.cartSubscription.unsubscribe();
        this.cartSubscription = null;
      }
    });
  }

  private refreshCartData(): void {
    // Refresh cart data when hover cart is opened
    this.cartIntegrationService.getCart().subscribe(cart => {
      console.log('🛒 [HoverCartComponent] Refreshing cart data - Items:', cart.items.length, 'Total:', cart.totalPrice);
      this.updateCartDisplay(cart);
    });
  }

  private loadCatalogData(): void {
    // Only load if not already loaded and not currently loading
    if (!this.catalogLoaded && this.catalogItems.length === 0 && !this.isCatalogLoading) {
      this.isCatalogLoading = true;
      console.log('📦 [HoverCartComponent] Loading catalog data...');
      this.catalogService.getCatalogList().subscribe({
        next: (catalogItems) => {
          this.isCatalogLoading = false;
          this.catalogLoaded = true;
          this.catalogItems = catalogItems;
          console.log('📦 [HoverCartComponent] Loaded catalog items:', catalogItems.length);
        },
        error: (error) => {
          this.isCatalogLoading = false;
          console.error('❌ [HoverCartComponent] Failed to load catalog:', error);
        }
      });
    } else {
      console.log('📦 [HoverCartComponent] Catalog already loaded or loading in progress');
    }
  }

  fetchImageForItem(itemId: string | number): string | undefined {
    // Convert itemId to number if it's a string
    const numericItemId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;
    
    // If catalogItems is not loaded yet, return undefined to prevent infinite calls
    if (!this.catalogItems || this.catalogItems.length === 0) {
      return undefined;
    }
    
    // If itemId is invalid, return undefined
    if (!numericItemId || isNaN(numericItemId)) {
      return undefined;
    }
    
    const item = this.catalogItems.find((toy) => toy.id === numericItemId);

    // If the item exists, return the photo link if available.
    if (item) {
      return item.photoLinks ? item.photoLinks[0] : null;
    }

    // If there is already a request for this item in progress, do nothing.
    if (this.fetchRequests.has(numericItemId)) {
      return undefined;
    }

    // Only make individual API calls if we have a valid numericItemId and catalog is loaded
    if (numericItemId && !isNaN(numericItemId) && this.catalogItems.length > 0) {
      // Mark that a request for this item is in progress.
      this.fetchRequests.set(numericItemId, true);

      // Fetch the item from the catalog service and update the catalogItems list.
      this.catalogService.getCatalogItem(numericItemId).subscribe({
        next: (val) => {
          this.catalogItems.push(val);
          // Remove the itemId from the fetchRequests map once the item is retrieved.
          this.fetchRequests.delete(numericItemId);
        },
        error: (err) => {
          console.error('Failed to fetch catalog item:', err);
          // Remove the itemId from the fetchRequests map on error.
          this.fetchRequests.delete(numericItemId);
        }
      });
    }

    return undefined;
  }
} 