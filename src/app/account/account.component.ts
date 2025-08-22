import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared-services/authentication.service';
import { AddressService, Address } from '../shared-services/address.service';
import { UserService } from '../shared-services/user.service';
import { User } from '../shared-services/user';
import { OrderDTO } from '../shared-services/order';
import { OrderService } from '../shared-services/order.service';
import { HeaderComponent } from '../shared/header/header.component';
import { ViewChild } from '@angular/core';

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
  orders: OrderDTO[] = [];
  displayOrders: any[] = []; // Transformed orders for display
  
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
  
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(
    private authService: AuthenticationService,
    private addressService: AddressService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if accessing via /orders route and switch to orders tab
    if (this.router.url.includes('/orders')) {
      this.activeTab = 'orders';
    }
    
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
            
            // Update global user details in AuthenticationService so header gets updated
            const updatedUserForAuth = {
              ...this.currentUser,
              name: this.currentUser.name,
              email: this.currentUser.email,
              mobileNumber: this.currentUser.mobileNumber,
              firstName: this.profileForm.firstName,
              lastName: this.profileForm.lastName
            };
            
            // Update localStorage and notify AuthenticationService
            this.updateUserDetailsInLocalStorage(updatedUserForAuth);
            
            // Force header component to refresh user data from UserService
            // This will update the navbar with the latest user data
            setTimeout(() => {
              if (this.headerComponent) {
                this.headerComponent.refreshUserData();
              }
            }, 100);
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
    if (!this.currentUser?.id) {
      console.error('No user ID available to load orders');
      return;
    }

    this.loading = true;
    this.orderService.getOrders(this.currentUser.id.toString()).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.displayOrders = this.transformOrdersForDisplay(orders);
        this.loading = false;
        console.log('✅ [AccountComponent] Loaded orders:', orders);
        console.log('✅ [AccountComponent] Transformed orders:', this.displayOrders);
      },
      error: (error) => {
        console.error('❌ [AccountComponent] Error loading orders:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load orders. Please try again later.';
        
        // Fallback to show empty state rather than stub data
        this.orders = [];
        this.displayOrders = [];
      }
    });
  }

  /**
   * Transform OrderDTO from backend to format expected by template
   */
  private transformOrdersForDisplay(orders: OrderDTO[]): any[] {
    // Sort orders by creation date (latest first) before transforming
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.creationDate || 0);
      const dateB = new Date(b.creationDate || 0);
      return dateB.getTime() - dateA.getTime(); // Descending order (latest first)
    });
    
    console.log('📅 [AccountComponent] Orders sorted by date (latest first):', sortedOrders.map(o => ({
      id: o.id,
      creationDate: o.creationDate
    })));
    
    return sortedOrders.map(order => {
      let items: any[] = [];
      let totalAmount = 0;
      let shippingAddress: any = {
        fullName: 'Customer Name',
        addressLine1: 'Address details not available',
        addressLine2: '',
        city: 'City',
        state: 'State',
        pincode: '000000'
      };
      
      console.log('🔍 [ORDER ADDRESS] Raw order data for order ID:', order.id);
      console.log('🔍 [ORDER ADDRESS] Full order object:', order);
      
      // Parse purchaseSummary to extract items, total, and address
      if (order.purchaseSummary) {
        try {
          const purchaseData = JSON.parse(order.purchaseSummary);
          console.log('🔍 [ORDER ADDRESS] Parsed purchaseSummary:', purchaseData);
          
          // Extract items from cartSummary
          if (purchaseData.cartSummary?.items) {
            items = purchaseData.cartSummary.items.map((item: any) => ({
              productName: item.name || item.itemName || 'Unknown Product',
              quantity: item.quantity || 1,
              price: item.price?.amount || item.price || 0,
              size: item.size || null,
              packagingType: item.packagingType || null
            }));
          }
          
          // Extract total amount
          totalAmount = purchaseData.cartSummary?.totalAmount || 
                       purchaseData.totalAmount || 
                       items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          // 🔍 Check for address information in different possible locations
          console.log('🔍 [ORDER ADDRESS] Looking for address in purchaseData...');
          
          // Check common address field names
          const possibleAddressFields = [
            'shippingAddress', 'deliveryAddress', 'address', 'billingAddress',
            'customerAddress', 'userAddress', 'addressDetails', 'delivery',
            'shipping', 'addressInfo', 'contactInfo'
          ];
          
          possibleAddressFields.forEach(field => {
            if (purchaseData[field]) {
              console.log(`🔍 [ORDER ADDRESS] Found address data in ${field}:`, purchaseData[field]);
            }
          });
          
          // Check in cartSummary for address
          if (purchaseData.cartSummary) {
            console.log('🔍 [ORDER ADDRESS] CartSummary contents:', Object.keys(purchaseData.cartSummary));
            possibleAddressFields.forEach(field => {
              if (purchaseData.cartSummary[field]) {
                console.log(`🔍 [ORDER ADDRESS] Found address data in cartSummary.${field}:`, purchaseData.cartSummary[field]);
              }
            });
          }
          
          // Try to extract address from any found location
          const foundAddress = purchaseData.shippingAddress || 
                              purchaseData.deliveryAddress || 
                              purchaseData.address ||
                              purchaseData.cartSummary?.shippingAddress ||
                              purchaseData.cartSummary?.deliveryAddress ||
                              purchaseData.cartSummary?.address;
          
          if (foundAddress) {
            console.log('✅ [ORDER ADDRESS] Found address data:', foundAddress);
            shippingAddress = {
              fullName: foundAddress.fullName || foundAddress.name || foundAddress.customerName || 'Customer Name',
              addressLine1: foundAddress.addressLine1 || foundAddress.address1 || foundAddress.street || foundAddress.firstLine || 'Address not available',
              addressLine2: foundAddress.addressLine2 || foundAddress.address2 || foundAddress.secondLine || '',
              city: foundAddress.city || 'City',
              state: foundAddress.state || 'State',
              pincode: foundAddress.pincode || foundAddress.zipCode || foundAddress.zip || '000000'
            };
          } else {
            console.log('❌ [ORDER ADDRESS] No address data found in order');
          }
          
        } catch (e) {
          console.error('❌ [ORDER ADDRESS] Error parsing purchaseSummary:', e);
          items = [{
            productName: 'Order Details Unavailable',
            quantity: 1,
            price: 0
          }];
        }
      } else {
        console.log('❌ [ORDER ADDRESS] No purchaseSummary found in order');
      }

      const transformedOrder = {
        id: order.id,
        orderNumber: `ORD-${order.id}`,
        orderDate: order.creationDate || new Date(),
        paymentStatus: this.mapPaymentStatusToOrderStatus(order.paymentStatus),
        shippingStatus: this.mapShippingStatusToOrderStatus(order.dispatchSummary?.shipmentStatus),
        totalAmount: totalAmount,
        items: items,
        shippingAddress: shippingAddress,
        invoiceUrl: null // Set to actual URL if available
      };
      
      console.log('✅ [ORDER ADDRESS] Final transformed order:', transformedOrder);
      return transformedOrder;
    });
  }

  /**
   * Map PaymentStatus enum to user-friendly order status
   */
  private mapPaymentStatusToOrderStatus(paymentStatus: any): string {
    // Handle both numeric and string values
    const status = paymentStatus?.toString().toUpperCase();
    
    switch (status) {
      case '0':
      case 'PAYMENTINITIATED':
        return 'pending';
      case '1':
      case 'PAYMENTFAILED':
        return 'cancelled';
      case '2':
      case 'PAYMENTSUCCESS':
        return 'confirmed';
      default:
        console.warn('⚠️ [AccountComponent] Unknown payment status:', paymentStatus);
        return 'pending';
    }
  }

  /**
   * Map shipping status to user-friendly order status
   */
  private mapShippingStatusToOrderStatus(shipmentStatus: any): string {
    if (!shipmentStatus) {
      return 'not_dispatched';
    }
    
    switch (shipmentStatus) {
      case 'READYTODISPATCH':
        return 'ready_to_dispatch';
      case 'DISPATCHED':
        return 'dispatched';
      case 'DELIVERED':
        return 'delivered';
      default:
        return 'not_dispatched';
    }
  }

  // Tab navigation
  setActiveTab(tab: 'profile' | 'addresses' | 'orders'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (tab === 'addresses') {
      this.refreshAddresses();
    } else if (tab === 'orders') {
      this.loadOrders(); // ✅ Now OrderService is properly used when orders tab is clicked
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
          currentUserData.profiles || []
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
                // Note: We'll handle this differently since updateUserDetails is private
                this.updateUserDetailsInLocalStorage(updatedUserForAuth);
                
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

  // Helper method to update user details in localStorage
  private updateUserDetailsInLocalStorage(userDetails: any) {
    const USER_DETAILS = 'userDetails';
    if (userDetails === '') {
      localStorage.setItem(USER_DETAILS, '');
    } else {
      localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails));
    }
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

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'confirmed': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Payment Pending';
      case 'confirmed': return 'Payment Completed';
      case 'cancelled': return 'Payment Failed';
      default: return 'Payment Unknown';
    }
  }

  getShippingStatusClass(status: string): string {
    switch (status) {
      case 'not_dispatched': return 'badge bg-secondary';
      case 'ready_to_dispatch': return 'badge bg-info text-dark';
      case 'dispatched': return 'badge bg-primary';
      case 'delivered': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  }

  getShippingStatusText(status: string): string {
    switch (status) {
      case 'not_dispatched': return 'Not Dispatched';
      case 'ready_to_dispatch': return 'Ready to Dispatch';
      case 'dispatched': return 'Dispatched';
      case 'delivered': return 'Delivered';
      default: return 'Status Unknown';
    }
  }

  logout(): void {
    this.authService.logoutUser();
    this.router.navigate(['/']);
  }
} 