import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../services/cart.service';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalItems = 0;
  totalPrice = 0;
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

  updateQuantity(itemIndex: number, quantity: number): void {
    this.cartService.updateQuantity(itemIndex, quantity);
  }

  removeItem(itemIndex: number): void {
    this.cartService.removeFromCart(itemIndex);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getItemTotal(item: CartItem): number {
    const price = this.extractPrice(item.product.price);
    return price * item.quantity;
  }

  extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[₹,]/g, '')) || 0;
  }

  proceedToPayment(): void {
    // Implement payment logic here
    console.log('Proceeding to payment...');
  }
} 