import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User, Address, Order } from '../services/auth.service';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  activeTab: 'profile' | 'addresses' | 'orders' = 'profile';
  currentUser: User | null = null;
  addresses: Address[] = [];
  orders: Order[] = [];
  
  // Profile form
  profileForm = {
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  };
  
  // Address form
  addressForm = {
    label: 'home',
    fullName: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  };
  
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Subscribe to user changes
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadProfileData();
        this.loadAddresses();
        this.loadOrders();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadProfileData(): void {
    if (this.currentUser) {
      this.profileForm = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email || '',
        mobile: this.currentUser.mobile
      };
    }
  }

  private loadAddresses(): void {
    this.loading = true;
    this.authService.getUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load addresses';
      }
    });
  }

  private loadOrders(): void {
    this.loading = true;
    this.authService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load orders';
      }
    });
  }

  // Tab navigation
  setActiveTab(tab: 'profile' | 'addresses' | 'orders'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Profile management
  updateProfile(): void {
    if (!this.profileForm.firstName.trim() || !this.profileForm.lastName.trim()) {
      this.errorMessage = 'Please enter your first name and last name';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Simulate profile update (in real app, this would call an API)
    setTimeout(() => {
      if (this.currentUser) {
        this.currentUser.firstName = this.profileForm.firstName.trim();
        this.currentUser.lastName = this.profileForm.lastName.trim();
        this.currentUser.email = this.profileForm.email.trim() || undefined;
        
        // Update in auth service
        this.authService.login(this.currentUser);
        
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
      }
    }, 1000);
  }

  // Address management
  addAddress(): void {
    if (!this.addressForm.fullName.trim() || !this.addressForm.addressLine1.trim() || 
        !this.addressForm.city.trim() || !this.addressForm.state.trim() || !this.addressForm.pincode.trim()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const newAddress: Omit<Address, 'id'> = {
      label: this.addressForm.label,
      fullName: this.addressForm.fullName.trim(),
      mobile: this.addressForm.mobile.trim(),
      addressLine1: this.addressForm.addressLine1.trim(),
      addressLine2: this.addressForm.addressLine2.trim(),
      city: this.addressForm.city.trim(),
      state: this.addressForm.state.trim(),
      pincode: this.addressForm.pincode.trim(),
      isDefault: this.addressForm.isDefault
    };

    this.authService.saveAddress(newAddress).subscribe({
      next: (response) => {
        if (response.success && response.address) {
          this.addresses.push(response.address);
          this.resetAddressForm();
          this.successMessage = 'Address added successfully!';
        } else {
          this.errorMessage = response.message || 'Failed to add address';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error adding address:', error);
        this.errorMessage = 'Failed to add address';
        this.loading = false;
      }
    });
  }

  private resetAddressForm(): void {
    this.addressForm = {
      label: 'home',
      fullName: '',
      mobile: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    };
  }

  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      // Simulate address deletion (in real app, this would call an API)
      this.addresses = this.addresses.filter(addr => addr.id !== addressId);
      this.successMessage = 'Address deleted successfully!';
    }
  }

  // Order management
  downloadInvoice(orderId: string): void {
    this.loading = true;
    this.authService.downloadInvoice(orderId).subscribe({
      next: (response) => {
        if (response.success && response.url) {
          // Simulate file download
          const link = document.createElement('a');
          link.href = response.url;
          link.download = `invoice-${orderId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          this.successMessage = 'Invoice download started!';
        } else {
          this.errorMessage = response.message || 'Failed to download invoice';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        this.errorMessage = 'Failed to download invoice';
        this.loading = false;
      }
    });
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge bg-warning';
      case 'confirmed': return 'badge bg-info';
      case 'shipped': return 'badge bg-primary';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getOrderStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
} 