import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartIntegrationService } from '../../services/cart-integration.service';
import { AuthenticationService } from '../../shared-services/authentication.service';
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
  private cartSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private cartIntegrationService: CartIntegrationService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.cartSubscription = this.cartIntegrationService.getCart().subscribe(cart => {
      this.totalItems = cart.items ? cart.items.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
    });
    
    // Subscribe to user details changes
    this.userSubscription = this.authService.userDetails.subscribe(userDetails => {
      console.log('🔍 [HEADER] User details changed:', userDetails);
      if (userDetails && userDetails !== '') {
        this.currentUser = userDetails;
        console.log('✅ [HEADER] Current user updated:', this.currentUser);
      } else {
        this.currentUser = null;
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
