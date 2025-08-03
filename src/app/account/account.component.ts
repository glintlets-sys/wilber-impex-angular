import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AddressService, Address } from '../services/address.service';
import { UserService } from '../services/user.service';
import { User, Order } from '../services/interfaces';
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
  
  // Address management
  showAddressForm = false;
  editingAddress: Address | null = null;
  add_address: boolean = false;
  newAddress: Address = {
    id: 0,
    firstLine: '',
    userId: 0,
    secondLine: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    mobileNumber: '',
    alternateNumber: '',
    emailAddress: '',
    isDefault: false
  };
  
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  private userSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private addressService: AddressService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.isUserLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn !== 'true') {
        this.router.navigate(['/login']);
        return;
      }
    });

    // Subscribe to user changes
    this.userSubscription = this.authService.userDetails.subscribe(userDetails => {
      if (userDetails && userDetails !== '') {
        this.currentUser = userDetails;
        this.loadProfileData();
        this.loadOrders();
        this.loadUserProfileFromBackend();
      }
    });

    // Load addresses when component initializes
    this.refreshAddresses();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadProfileData(): void {
    if (this.currentUser) {
      // Handle user format from backup service
      const name = this.currentUser.name || '';
      const email = this.currentUser.email || '';
      const mobile = this.currentUser.mobileNumber || '';
      
      // Split name into firstName and lastName
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      this.profileForm = {
        firstName,
        lastName,
        email,
        mobile
      };
    }
  }

  private loadUserProfileFromBackend(): void {
    console.log('📝 [PROFILE] Loading user profile from backend');
    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserByUsername(username).subscribe({
        next: (userProfile) => {
          console.log('✅ [PROFILE] User profile loaded from backend:', userProfile);
          console.log('✅ [PROFILE] userProfile.name:', userProfile.name);
          console.log('✅ [PROFILE] userProfile.email:', userProfile.email);
          console.log('✅ [PROFILE] userProfile.mobileNumber:', userProfile.mobileNumber);
          
          // Update profile form with backend data
          if (userProfile.name) {
            // Check if the name field contains an email address
            const isEmail = userProfile.name.includes('@');
            if (isEmail) {
              console.log('⚠️ [PROFILE] Name field contains email, using email as name');
              // If name contains email, use it as the full name
              this.profileForm.firstName = userProfile.name;
              this.profileForm.lastName = '';
            } else {
              // Normal name splitting
              const nameParts = userProfile.name.split(' ');
              this.profileForm.firstName = nameParts[0] || '';
              this.profileForm.lastName = nameParts.slice(1).join(' ') || '';
            }
            console.log('✅ [PROFILE] Split name - firstName:', this.profileForm.firstName, 'lastName:', this.profileForm.lastName);
          }
          this.profileForm.email = userProfile.email || '';
          this.profileForm.mobile = userProfile.mobileNumber || '';
          console.log('✅ [PROFILE] Final form data:', this.profileForm);
          
          // Update current user with backend data
          if (this.currentUser) {
            this.currentUser.name = `${this.profileForm.firstName} ${this.profileForm.lastName}`.trim();
            this.currentUser.email = this.profileForm.email;
            this.currentUser.mobileNumber = this.profileForm.mobile;
            // Don't call updateUserDetails here to avoid infinite loop
          }
        },
        error: (error) => {
          console.error('❌ [PROFILE] Error loading user profile from backend:', error);
          // Continue with local data if backend fails
        }
      });
    }
  }

  // Address management methods
  refreshAddresses() {
    this.addressService.getAllAddresses().subscribe({
      next: (val) => {
        this.addresses = val;
        console.log('✅ [ADDRESS] Addresses loaded successfully:', val);
      },
      error: (error) => {
        console.error('❌ [ADDRESS] Error fetching addresses:', error);
        if (error.message && error.message.includes('User ID not available')) {
          this.errorMessage = 'User session expired. Please login again.';
          // Optionally redirect to login
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = 'Failed to load addresses. Please try again.';
        }
      }
    });
  }

  addAdress() {
    this.add_address = true;
  }

  cancelNewAddress() {
    this.add_address = false;
    this.clearAddressData();
  }

  saveNewAddress() {
    const requiredFields = ['firstLine', 'city', 'state', 'pincode', 'mobileNumber', 'emailAddress'];

    for (const field of requiredFields) {
      if (this.newAddress[field as keyof Address] === '') {
        this.errorMessage = `Please enter the ${field}`;
        return;
      }

      if (this.newAddress.pincode?.length < 6) {
        this.errorMessage = `Pincode should be 6 digits.`;
        return;
      }

      if (this.newAddress.mobileNumber?.length < 10) {
        this.errorMessage = `Mobile number should be 10 digits.`;
        return;
      }
    }

    // Set the userId from the auth service before sending
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User not found. Please login again.';
      return;
    }

    // Create a copy of the address with the correct userId
    const addressToSave = { ...this.newAddress, userId: userId };

    this.addressService.addAddress(addressToSave).subscribe({
      next: (val) => {
        this.add_address = false;
        this.clearAddressData();
        this.refreshAddresses();
        this.successMessage = 'Address added successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ [ADDRESS] Error adding address:', error);
        this.errorMessage = 'Failed to add address. Please try again.';
      }
    });
  }

  clearAddressData() {
    this.newAddress = {
      id: 0,
      userId: 0, // Will be set when saving
      firstLine: '',
      secondLine: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      mobileNumber: '',
      alternateNumber: '',
      emailAddress: '',
      isDefault: false
    };
  }

  deleteAddress(address: Address) {
    this.addressService.deleteAddress(address).subscribe({
      next: (val) => {
        this.refreshAddresses();
        this.successMessage = 'Address deleted successfully!';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ [ADDRESS] Error deleting address:', error);
        this.errorMessage = 'Failed to delete address. Please try again.';
      }
    });
  }





  private loadOrders(): void {
    this.loading = true;
    // Stub orders data since backup doesn't have getUserOrders method
    const stubOrders: Order[] = [
      {
        id: 'order_1',
        orderNumber: 'ORD-2024-001',
        orderDate: new Date('2024-01-15'),
        status: 'delivered',
        totalAmount: 2500.00,
        items: [
          {
            productId: 'prod_1',
            productName: 'Cement Cleaner',
            quantity: 2,
            price: 1250.00,
            size: '1kg',
            packagingType: 'Polythene Bag'
          }
        ],
        shippingAddress: null,
        invoiceUrl: '/invoices/ORD-2024-001.pdf'
      }
    ];
    
    setTimeout(() => {
      this.orders = stubOrders;
      this.loading = false;
    }, 500);
  }

  // Tab navigation
  setActiveTab(tab: 'profile' | 'addresses' | 'orders'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (tab === 'addresses') {
      this.refreshAddresses();
    }
  }

  // Profile management
  updateProfile(): void {
    console.log('🔍 [PROFILE] updateProfile() method called');
    console.log('🔍 [PROFILE] Current form data:', this.profileForm);
    
    if (!this.profileForm.firstName.trim() || !this.profileForm.lastName.trim()) {
      console.log('❌ [PROFILE] Validation failed - missing first name or last name');
      this.errorMessage = 'Please enter your first name and last name';
      return;
    }

    console.log('✅ [PROFILE] Validation passed, starting update...');
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const username = this.authService.getUsername();
    if (!username) {
      console.log('❌ [PROFILE] No username found');
      this.errorMessage = 'User not found. Please login again.';
      this.loading = false;
      return;
    }

    // First get the current user data to get the id, then update
    this.userService.getUserByUsername(username).subscribe({
      next: (currentUserData) => {
        console.log('📝 [PROFILE] Current user data from backend:', currentUserData);
        
        // Create complete user object with id from backend
        const updateData = new User(
          currentUserData.id,
          `${this.profileForm.firstName.trim()} ${this.profileForm.lastName.trim()}`,
          this.profileForm.email.trim() || '',
          currentUserData.mobileNumber || '',
          currentUserData.address || '',
          currentUserData.pincode || '',
          currentUserData.profilePictureUrl || '',
          currentUserData.creationDate || new Date(),
          currentUserData.age || 0,
          currentUserData.sex || '',
          currentUserData.profiles || [],
          currentUserData.username || username,
          currentUserData.state || '',
          currentUserData.city || ''
        );

        console.log('📝 [PROFILE] Updating user profile with complete data including id:', updateData);
        console.log('📝 [PROFILE] Calling userService.updateUserByUsername()');

                // Call backend API to update profile with complete user object
        this.userService.updateUserByUsername(username, updateData).subscribe({
          next: (updatedUser) => {
            console.log('✅ [PROFILE] Profile updated successfully:', updatedUser);
            
            // Fetch the updated user data from backend to ensure we have the latest
            this.userService.getUserByUsername(username).subscribe({
              next: (freshUserData) => {
                console.log('✅ [PROFILE] Fetched fresh user data:', freshUserData);
                
                // Create user object for auth service (matching the format expected)
                const updatedUserForAuth = {
                  firstName: this.profileForm.firstName.trim(),
                  lastName: this.profileForm.lastName.trim(),
                  email: this.profileForm.email.trim() || undefined,
                  mobile: freshUserData.mobileNumber || '',
                  userId: freshUserData.id,
                  username: freshUserData.username || username,
                  role: '', // Default role since User class doesn't have role property
                  name: freshUserData.name || `${this.profileForm.firstName.trim()} ${this.profileForm.lastName.trim()}`
                };
                
                // Update in auth service - this will also update localStorage
                this.authService.updateUserDetails(updatedUserForAuth);
                
                // Update user name in user service
                this.userService.storeuserNameData.next(updatedUserForAuth.name || '');
                
                this.successMessage = 'Profile updated successfully!';
                this.loading = false;
              },
              error: (fetchError) => {
                console.error('❌ [PROFILE] Error fetching updated user data:', fetchError);
                // Still show success but log the error
                this.successMessage = 'Profile updated successfully!';
                this.loading = false;
              }
            });
          },
          error: (error) => {
            console.error('❌ [PROFILE] Error updating profile:', error);
            this.errorMessage = 'Failed to update profile. Please try again.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('❌ [PROFILE] Error getting current user data:', error);
        this.errorMessage = 'Failed to get user data. Please try again.';
        this.loading = false;
      }
    });
  }



  // Order management
  downloadInvoice(orderId: string): void {
    this.loading = true;
    // Stub invoice download since backup doesn't have this method
    setTimeout(() => {
      // Simulate file download
      const link = document.createElement('a');
      link.href = `/invoices/ORD-${orderId}.pdf`;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.successMessage = 'Invoice download started!';
      this.loading = false;
    }, 500);
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
    this.authService.logoutUser();
    this.router.navigate(['/']);
  }
} 