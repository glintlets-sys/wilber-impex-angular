import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-stone-solutions',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './stone-solutions.component.html',
  styleUrl: './stone-solutions.component.scss'
})
export class StoneSolutionsComponent implements OnInit, AfterViewInit {

  stoneProducts = [
    {
      title: 'Cementitious Tile Adhesive',
      image: 'assets/images/wilber_product/new_img/TILE%20ADHESIVE.png',
      link: '/stone-solution/cementitious-tile-adhesive'
    },
    {
      title: 'Epoxy Grout',
      image: 'assets/images/wilber_product/new_img/EPOXY%20GROUT1.png',
      link: '/stone-solution/epoxy-grout'
    },
    {
      title: 'Sealers',
      image: 'assets/images/wilber_product/new_img/SEALERS.png',
      link: '/stone-solution/sealers'
    },
    {
      title: 'Cleaners',
      image: 'assets/images/wilber_product/new_img/CLEANERS.png',
      link: '/stone-solution/cleaners'
    },
    {
      title: 'Mastic',
      image: 'assets/images/wilber_product/new_img/MASTIC.png',
      link: '/stone-solution/mastic'
    },
    {
      title: 'Epoxy Products',
      image: 'assets/images/wilber_product/new_img/MARBLE%20EPOXY.png',
      link: '/stone-solution/epoxy-products'
    },
    {
      title: 'Ager / Polish',
      image: 'assets/images/wilber_product/new_img/SHINER.png',
      link: '/stone-solution/ager-polish'
    },
    {
      title: 'Lapizo Bond (5mins Set)',
      image: 'assets/images/wilber_product/new_img/LAPIZO%20BOND.png',
      link: '/stone-solution/lapizo-bond'
    },
    {
      title: 'Marble Densifier',
      image: 'assets/images/wilber_product/new_img/DENSIFIER.png',
      link: '/stone-solution/marble-densifier'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services
  }

  ngAfterViewInit(): void {
    this.initializeScrollEffects();
  }

  private initializeScrollEffects(): void {
    // Back to top button functionality
    const backToTop = document.getElementById('backToTop');
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