import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

declare var Swiper: any;

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
    this.initializeScrollEffects();
  }

  private initializeSwiper(): void {
    // Initialize blog slider
    if (typeof Swiper !== 'undefined') {
      const blogSlider = new Swiper('.blog-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }
      });
    }
  }

  private initializeScrollEffects(): void {
    // Back to top button functionality
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      });

      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Header scroll effect
    const header = document.querySelector('.main-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
          (header as HTMLElement).style.padding = '10px 0';
          (header as HTMLElement).style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
          (header as HTMLElement).style.padding = '15px 0';
          (header as HTMLElement).style.boxShadow = '0 2px 15px rgba(0,0,0,0.05)';
        }
      });
    }
  }
}
