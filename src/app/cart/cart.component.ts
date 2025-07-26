import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CartService, Cart, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(itemIndex: number, newQuantity: number): void {
    this.cartService.updateQuantity(itemIndex, newQuantity);
  }

  removeItem(itemIndex: number): void {
    this.cartService.removeFromCart(itemIndex);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/stone-solutions']);
  }

  proceedToCheckout(): void {
    // Navigate to checkout page (to be implemented)
    this.router.navigate(['/checkout']);
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
    while (stars.length < 5) {
      stars.push(0);
    }
    return stars;
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }
} 