import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
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
  totalItems = 0;
  private cartSubscription: Subscription;

  constructor(private cartService: CartService) {
    this.cartSubscription = this.cartService.getCart().subscribe(cart => {
      this.totalItems = cart.totalItems;
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

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
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
