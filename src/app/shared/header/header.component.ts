import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartIntegrationService } from '../../services/cart-integration.service';
import { AuthenticationService } from '../../shared-services/authentication.service';
import { UserService } from '../../shared-services/user.service';
import { User } from '../../shared-services/user';
import { Subscription } from 'rxjs';
import { HoverCartComponent } from '../hover-cart/hover-cart.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HoverCartComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  isUserDropdownOpen = false;
  totalItems = 0;
  currentUser: User | null = null;
  isAdmin = false;
  private cartSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private cartIntegrationService: CartIntegrationService,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router
  ) {
    this.cartSubscription = this.cartIntegrationService.getCart().subscribe(cart => {
      this.totalItems = cart.items ? cart.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
    });
    
    // Subscribe to authentication status changes
    this.userSubscription = this.authService.userDetails.subscribe(authDetails => {
      console.log('🔍 [HEADER] Auth details changed:', authDetails);
      if (authDetails && authDetails !== '') {
        // User is logged in, fetch complete user data from UserService
        this.loadUserDataFromUserService();
        this.isAdmin = this.authService.isUserAdmin();
        console.log('✅ [HEADER] Is admin:', this.isAdmin);
      } else {
        this.currentUser = null;
        this.isAdmin = false;
        console.log('✅ [HEADER] User cleared');
      }
    });
  }

  ngOnInit() {
    this.initializeHeaderEffects();
    this.initializeDropdownHandlers();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    // Prevent Bootstrap from interfering
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
      if (dropdownMenu && dropdownMenu.classList) {
        dropdownMenu.classList.toggle('show', this.isDropdownOpen);
      }
    }, 0);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    // Ensure dropdown is closed
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.nav-item.dropdown .dropdown-menu');
      if (dropdownMenu && dropdownMenu.classList) {
        dropdownMenu.classList.remove('show');
      }
    }, 0);
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    // Prevent Bootstrap from interfering
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.user-account .dropdown-menu');
      if (dropdownMenu && dropdownMenu.classList) {
        dropdownMenu.classList.toggle('show', this.isUserDropdownOpen);
      }
    }, 0);
  }

  closeUserDropdown() {
    this.isUserDropdownOpen = false;
    // Ensure dropdown is closed
    setTimeout(() => {
      const dropdownMenu = document.querySelector('.user-account .dropdown-menu');
      if (dropdownMenu && dropdownMenu.classList) {
        dropdownMenu.classList.remove('show');
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logoutUser();
    this.router.navigate(['/']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  loadUserDataFromUserService(): void {
    const username = this.authService.getUsername();
    if (username) {
      console.log('🔍 [HEADER] Loading user data from UserService for username:', username);
      this.userService.getUserByUsername(username).subscribe({
        next: (userData) => {
          console.log('✅ [HEADER] User data loaded from UserService:', userData);
          this.currentUser = userData;
          console.log('✅ [HEADER] User data structure:', {
            name: this.currentUser?.name,
            username: this.currentUser?.username,
            firstName: (this.currentUser as any)?.firstName,
            fullName: (this.currentUser as any)?.fullName,
            mobileNumber: this.currentUser?.mobileNumber,
            displayName: this.getUserDisplayName()
          });
        },
        error: (error) => {
          console.error('❌ [HEADER] Error loading user data from UserService:', error);
          // Fallback to auth data if UserService fails
          // Get auth data from localStorage as fallback
          const userDetailsString = localStorage.getItem('userDetails');
          if (userDetailsString) {
            try {
              const authDetails = JSON.parse(userDetailsString);
              this.currentUser = authDetails;
              console.log('✅ [HEADER] Fallback to auth data:', authDetails);
            } catch (parseError) {
              console.error('❌ [HEADER] Error parsing auth data:', parseError);
            }
          }
        }
      });
    } else {
      console.warn('⚠️ [HEADER] No username available for UserService call');
    }
  }

  getUserDisplayName(): string {
    if (!this.currentUser) {
      return 'User';
    }

    // Try different possible name fields in order of preference
    if (this.currentUser.name && this.currentUser.name.trim() !== '') {
      return this.currentUser.name;
    }

    if (this.currentUser.username && this.currentUser.username.trim() !== '') {
      return this.currentUser.username;
    }

    // Check if there's a firstName field in the user data
    if ((this.currentUser as any).firstName && (this.currentUser as any).firstName.trim() !== '') {
      return (this.currentUser as any).firstName;
    }

    // Check if there's a fullName field in the user data
    if ((this.currentUser as any).fullName && (this.currentUser as any).fullName.trim() !== '') {
      return (this.currentUser as any).fullName;
    }

    // If mobile number is available, show a masked version
    if (this.currentUser.mobileNumber && this.currentUser.mobileNumber.trim() !== '') {
      const mobile = this.currentUser.mobileNumber;
      if (mobile.length >= 10) {
        return `User ${mobile.slice(-4)}`; // Show last 4 digits
      }
      return mobile;
    }

    // Final fallback
    return 'User';
  }

  // Public method to refresh user data (can be called from other components)
  public refreshUserData(): void {
    console.log('🔄 [HEADER] Refreshing user data from UserService');
    this.loadUserDataFromUserService();
  }



  private initializeHeaderEffects() {
    const header = document.querySelector('.main-header');
    if (header && header.setAttribute) {
      window.addEventListener('scroll', () => {
        // Re-check if header still exists before modifying
        const currentHeader = document.querySelector('.main-header');
        if (currentHeader && currentHeader.setAttribute) {
          if (window.pageYOffset > 100) {
            currentHeader.setAttribute('style', 'box-shadow: 0 2px 20px rgba(0,0,0,0.1)');
          } else {
            currentHeader.setAttribute('style', 'box-shadow: 0 2px 15px rgba(0,0,0,0.05)');
          }
        }
      });
    }
  }

  private initializeDropdownHandlers() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const userAccount = document.querySelector('.user-account');
      const productsDropdown = document.querySelector('.nav-item.dropdown');
      
      if (userAccount && !userAccount.contains(target)) {
        this.closeUserDropdown();
      }
      
      if (productsDropdown && !productsDropdown.contains(target)) {
        this.closeDropdown();
      }
    });

    // Prevent Bootstrap from initializing dropdowns
    const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownElements.forEach(element => {
      if (element && element.removeAttribute) {
        element.removeAttribute('data-bs-toggle');
      }
    });
  }
}
