import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

// Blog data interface
interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  tags: string[];
}

// Sample blog data - same as in blog-detail component
const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'engineered-wood-flooring',
    title: 'How to Install Engineered Wood Flooring',
    excerpt: 'Learn the step-by-step process of installing engineered wood flooring for a beautiful and durable result in your home or commercial space.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-03-10',
    category: 'Flooring',
    image: 'assets/images/resource/news-1.jpg',
    readTime: '3 min read',
    tags: ['flooring', 'engineered wood', 'installation', 'diy']
  },
  {
    id: 2,
    slug: 'wood-flooring-finishes',
    title: 'What Are The Different Finishes Of Wood Flooring?',
    excerpt: 'Explore the various finishes available for wood flooring, from matte to glossy, and understand which option best suits your specific needs.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-03-08',
    category: 'Flooring',
    image: 'assets/images/resource/news-2.jpg',
    readTime: '4 min read',
    tags: ['flooring', 'finishes', 'wood', 'maintenance']
  },
  {
    id: 3,
    slug: 'engineered-wood-advantages',
    title: 'Advantages of Engineered Wood Flooring',
    excerpt: 'Discover the numerous benefits of choosing engineered wood flooring over solid hardwood, including improved stability, versatility, and cost-effectiveness.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-03-05',
    category: 'Flooring',
    image: 'assets/images/resource/news-3.jpg',
    readTime: '3 min read',
    tags: ['flooring', 'engineered wood', 'advantages', 'comparison']
  },
  {
    id: 4,
    slug: 'industrial-floor-maintenance',
    title: '5 Essential Tips for Industrial Floor Maintenance',
    excerpt: 'Learn the key strategies to maintain industrial floors in optimal condition, preventing damage and extending their lifespan while ensuring safety.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-03-01',
    category: 'Industrial',
    image: 'assets/images/resource/news-1.jpg',
    readTime: '5 min read',
    tags: ['industrial', 'maintenance', 'safety', 'cleaning']
  },
  {
    id: 5,
    slug: 'marble-care-maintenance',
    title: 'The Ultimate Guide to Marble Care and Maintenance',
    excerpt: 'Protect and maintain the beauty of your marble surfaces with these expert tips on cleaning, sealing, and preventing damage to natural stone.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-02-25',
    category: 'Stone Care',
    image: 'assets/images/resource/news-2.jpg',
    readTime: '4 min read',
    tags: ['marble', 'stone care', 'maintenance', 'cleaning']
  },
  {
    id: 6,
    slug: 'tile-adhesive-guide',
    title: 'Choosing the Right Tile Adhesive for Your Project',
    excerpt: 'Understand the different types of tile adhesives available and how to select the perfect option for your specific tiling project requirements.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-02-20',
    category: 'Tile Solutions',
    image: 'assets/images/resource/news-3.jpg',
    readTime: '3 min read',
    tags: ['tile adhesive', 'installation', 'selection', 'tips']
  },
  {
    id: 7,
    slug: 'epoxy-grout-benefits',
    title: 'The Benefits of Epoxy Grout for Commercial Applications',
    excerpt: 'Discover why epoxy grout is the preferred choice for commercial and industrial tile installations, offering superior durability and maintenance benefits.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-02-15',
    category: 'Commercial Solutions',
    image: 'assets/images/resource/news-1.jpg',
    readTime: '4 min read',
    tags: ['epoxy grout', 'commercial', 'durability', 'hygiene']
  },
  {
    id: 8,
    slug: 'stone-care-essentials',
    title: 'Essential Stone Care Products for Natural Stone Maintenance',
    excerpt: 'Learn about the essential products and techniques needed to properly maintain and protect natural stone surfaces in residential and commercial settings.',
    content: '',
    author: 'Wilber Technical Team',
    date: '2025-02-10',
    category: 'Stone Care',
    image: 'assets/images/resource/news-2.jpg',
    readTime: '5 min read',
    tags: ['stone care', 'maintenance', 'products', 'natural stone']
  }
];

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit, AfterViewInit {

  blogPosts = BLOG_POSTS;

  constructor() { }

  ngOnInit(): void {
    // Initialize any data or services
  }

  ngAfterViewInit(): void {
    this.initializeScrollEffects();
  }

  onNewsletterSubmit(): void {
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
    // Here you would typically send the email to your backend
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
