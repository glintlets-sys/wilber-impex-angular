import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../services/cart.service';
import { AuthService, User, Address } from '../services/auth.service';
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
  currentUser: User | null = null;
  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  private cartSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart.items;
      this.totalItems = cart.totalItems;
      this.totalPrice = cart.totalPrice;
    });
    
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserAddresses();
      }
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadUserAddresses(): void {
    this.authService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        // Set default address if available
        const defaultAddress = addresses.find(addr => addr.isDefault);
        this.selectedAddress = defaultAddress || (addresses.length > 0 ? addresses[0] : null);
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
      }
    });
  }

  selectAddress(address: Address): void {
    this.selectedAddress = address;
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
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    // Implement payment logic here
    console.log('Proceeding to payment with address:', this.selectedAddress);
  }
} 