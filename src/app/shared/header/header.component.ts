import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;

  ngOnInit() {
    this.initializeHeaderEffects();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
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
