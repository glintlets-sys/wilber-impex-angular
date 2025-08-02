import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-promoted-categories',
  templateUrl: './promoted-categories.component.html',
  styleUrls: ['./promoted-categories.component.scss']
})
export class PromotedCategoriesComponent {

  isMobile = window.innerWidth <= 600;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile = (event.target as Window).innerWidth <= 600;
  }

  customOptions: OwlOptions = {
    loop: true,
    items: 2,
    margin: 5,
    slideBy: 2,
    nav: true,
    autoplay: false, // Enable Autoplay
    autoplayTimeout: 5000, // Set the delay between transitions to 1 second
    autoplayHoverPause: true, // Pause on hover
    responsive: {
      0: {
        items: 2, // For small screens (mobile), 1 item will make 2 items appear in 2 rows.
      },
      450: {
        items: 2, // For medium screens (tablets) and above, 2 items will appear in the same row.
      },
      700: {
        items: 2,
      },
      900: {
        items: 2,
      }
    },
  };

    // Dummy categories
    categories = [
      { id: 11, image: 'assets/img/creatives/Hotwheels.png' },
      { id: 12, image: 'assets/img/creatives/Barbie.png' }
    ];
  
    constructor(private router: Router) {}
  
    navigateToCatalog(categoryId: number) {
      this.router.navigate(['/categoryItems', categoryId]);
    }

}
