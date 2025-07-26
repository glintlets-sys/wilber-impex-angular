import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';
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
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.totalItems = cart.totalItems;
    });
    
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.initializeHeaderEffects();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeUserDropdown() {
    this.isUserDropdownOpen = false;
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
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  private initializeHeaderEffects() {
    const header = document.querySelector('.main-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
          header.setAttribute('style', 'box-shadow: 0 2px 20px rgba(0,0,0,0.1)');
        } else {
          header.setAttribute('style', 'box-shadow: 0 2px 15px rgba(0,0,0,0.05)');
        }
      });
    }
  }
}
