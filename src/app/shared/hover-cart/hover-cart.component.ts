import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hover-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hover-cart.component.html',
  styleUrls: ['./hover-cart.component.scss']
})
export class HoverCartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  displayItems: CartItem[] = [];
  displayItemTotals: { [key: number]: number } = {};
  totalItems = 0;
  totalPrice = 0;
  remainingItemsCount = 0;
  isOpen = false;
  private cartSubscription: Subscription;

  constructor(private cartService: CartService) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
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
    });
  }

  ngOnInit(): void {
    // Component initialization
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
  }

  removeItem(itemIndex: number): void {
    this.cartService.removeFromCart(itemIndex);
  }

  extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }
} 