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
  totalItems = 0;
  totalPrice = 0;
  isOpen = false;
  private cartSubscription: Subscription;

  constructor(private cartService: CartService) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart.items;
      this.totalItems = cart.totalItems;
      this.totalPrice = cart.totalPrice;
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

  getItemTotal(item: CartItem): number {
    const price = this.extractPrice(item.product.price);
    return price * item.quantity;
  }

  extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }

  getDisplayItems(): CartItem[] {
    // Show only first 3 items in hover cart
    return this.cartItems.slice(0, 3);
  }

  getRemainingItemsCount(): number {
    return Math.max(0, this.cartItems.length - 3);
  }
} 