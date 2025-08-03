import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../shared-services/cart.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { User } from '../shared-services/user';
import { AddressService, Address } from '../shared-services/address.service';
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
    private authService: AuthenticationService,
    private addressService: AddressService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.cartItems = cart.items;
      this.totalItems = cart.items ? cart.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
      this.totalPrice = cart.items ? cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) : 0;
    });
    
    this.userSubscription = this.authService.userDetails.subscribe(userDetails => {
      if (userDetails && userDetails !== '') {
        this.currentUser = userDetails;
      }
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.isUserLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn !== 'true') {
        this.router.navigate(['/login']);
        return;
      }
    });

    // Load addresses
    this.loadAddresses();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadAddresses(): void {
    this.addressService.getAllAddresses().subscribe(addresses => {
      this.addresses = addresses;
      // Set default address if available
      const defaultAddress = addresses.find(addr => addr.isDefault);
      this.selectedAddress = defaultAddress || (addresses.length > 0 ? addresses[0] : null);
    });
  }

  selectAddress(address: Address): void {
    this.selectedAddress = address;
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  updateQuantity(itemIndex: number, quantity: number): void {
    if (this.currentUser && this.cartItems[itemIndex]) {
      const item = this.cartItems[itemIndex];
      item.quantity = quantity;
      this.cartService.updateCartItem(this.currentUser.id, item).subscribe();
    }
  }

  removeItem(itemIndex: number): void {
    if (this.currentUser && this.cartItems[itemIndex]) {
      const item = this.cartItems[itemIndex];
      this.cartService.removeFromCart(this.currentUser.id, item).subscribe();
    }
  }

  clearCart(): void {
    // The shared service doesn't have a clearCart method
    // We'll need to remove items one by one or implement a different approach
    console.log('Clear cart functionality not available in shared service');
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
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