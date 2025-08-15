import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { BlogDataService, Blog } from '../shared-services/blog-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  externalUrl?: string; // URL to fetch HTML content from
}

// Sample blog data
const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'engineered-wood-flooring',
    title: 'How to Install Engineered Wood Flooring',
    excerpt: 'Learn the step-by-step process of installing engineered wood flooring for a beautiful and durable result in your home or commercial space.',
    externalUrl: 'https://example.com/blog-content/engineered-wood-flooring.html', // Example external URL
    content: `
      <p>Engineered wood flooring is a popular choice for homeowners and commercial spaces due to its durability, versatility, and beautiful appearance. Unlike solid hardwood, engineered wood consists of multiple layers that provide enhanced stability and resistance to moisture.</p>
      
      <h3>Pre-Installation Preparation</h3>
      <p>Before beginning the installation process, it's crucial to properly prepare your space and materials:</p>
      <ul>
        <li><strong>Acclimate the flooring:</strong> Allow the engineered wood to adjust to your home's humidity levels for 48-72 hours</li>
        <li><strong>Check subfloor condition:</strong> Ensure the subfloor is clean, dry, and level</li>
        <li><strong>Gather tools:</strong> You'll need a saw, measuring tape, spacers, and installation tools</li>
        <li><strong>Plan the layout:</strong> Determine the direction and pattern of installation</li>
      </ul>
      
      <h3>Installation Steps</h3>
      <ol>
        <li><strong>Prepare the subfloor:</strong> Clean thoroughly and repair any damage</li>
        <li><strong>Install underlayment:</strong> Lay down appropriate underlayment for moisture protection</li>
        <li><strong>Start installation:</strong> Begin from the longest wall, leaving expansion gaps</li>
        <li><strong>Continue rows:</strong> Stagger joints and ensure tight connections</li>
        <li><strong>Finish installation:</strong> Install baseboards and transition pieces</li>
      </ol>
      
      <h3>Professional Tips</h3>
      <p>For best results, consider these expert recommendations:</p>
      <ul>
        <li>Always leave expansion gaps around the perimeter</li>
        <li>Use appropriate fasteners for your subfloor type</li>
        <li>Stagger joints by at least 6 inches between rows</li>
        <li>Test fit pieces before final installation</li>
      </ul>
      
      <p>With proper installation, your engineered wood flooring will provide years of beauty and functionality.</p>
    `,
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
    content: `
      <p>Wood flooring finishes play a crucial role in both the appearance and durability of your floors. Understanding the different types of finishes available can help you make an informed decision for your space.</p>
      
      <h3>Types of Wood Flooring Finishes</h3>
      
      <h4>Oil-Based Finishes</h4>
      <p>Oil-based finishes penetrate deep into the wood, providing excellent protection and a natural appearance. They're known for their durability and ability to enhance the wood's natural grain.</p>
      
      <h4>Water-Based Finishes</h4>
      <p>Water-based finishes dry quickly and emit fewer VOCs, making them environmentally friendly. They provide a clear, protective coating that maintains the wood's natural color.</p>
      
      <h4>Polyurethane Finishes</h4>
      <p>Polyurethane finishes offer superior durability and resistance to wear. They're available in various sheens from matte to high-gloss.</p>
      
      <h3>Sheen Levels</h3>
      <ul>
        <li><strong>Matte:</strong> Low sheen, hides scratches well, modern appearance</li>
        <li><strong>Satin:</strong> Subtle shine, most popular choice</li>
        <li><strong>Semi-gloss:</strong> Moderate shine, easy to clean</li>
        <li><strong>High-gloss:</strong> Maximum shine, shows scratches easily</li>
      </ul>
      
      <h3>Choosing the Right Finish</h3>
      <p>Consider these factors when selecting a finish:</p>
      <ul>
        <li>Traffic level in the room</li>
        <li>Desired maintenance level</li>
        <li>Environmental concerns</li>
        <li>Overall design aesthetic</li>
      </ul>
      
      <p>The right finish can significantly impact both the beauty and longevity of your wood flooring investment.</p>
    `,
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
    content: `
      <p>Engineered wood flooring has become increasingly popular due to its numerous advantages over traditional solid hardwood. This innovative flooring solution combines the beauty of real wood with enhanced performance characteristics.</p>
      
      <h3>Key Advantages</h3>
      
      <h4>Enhanced Stability</h4>
      <p>Engineered wood's multi-layer construction provides superior dimensional stability, making it less prone to expansion and contraction due to temperature and humidity changes.</p>
      
      <h4>Versatility in Installation</h4>
      <p>Unlike solid hardwood, engineered wood can be installed in various ways:</p>
      <ul>
        <li>Floating installation over existing floors</li>
        <li>Glue-down installation</li>
        <li>Nail-down installation</li>
        <li>Installation over concrete slabs</li>
      </ul>
      
      <h4>Cost-Effectiveness</h4>
      <p>Engineered wood typically costs less than solid hardwood while providing similar aesthetic appeal and durability.</p>
      
      <h3>Environmental Benefits</h3>
      <ul>
        <li>Uses less premium wood per square foot</li>
        <li>More efficient use of natural resources</li>
        <li>Often made with sustainable practices</li>
        <li>Reduced waste during manufacturing</li>
      </ul>
      
      <h3>Performance Benefits</h3>
      <p>Engineered wood offers several performance advantages:</p>
      <ul>
        <li>Better resistance to moisture</li>
        <li>Reduced warping and cupping</li>
        <li>Compatible with radiant heating systems</li>
        <li>Longer lifespan with proper maintenance</li>
      </ul>
      
      <p>For many applications, engineered wood flooring provides the perfect balance of beauty, performance, and value.</p>
    `,
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
    content: `
      <p>Industrial floors face unique challenges including heavy traffic, chemical exposure, and mechanical stress. Proper maintenance is crucial for safety, efficiency, and cost-effectiveness.</p>
      
      <h3>Tip 1: Regular Cleaning Schedule</h3>
      <p>Establish a comprehensive cleaning routine that includes:</p>
      <ul>
        <li>Daily sweeping and debris removal</li>
        <li>Weekly deep cleaning with appropriate cleaners</li>
        <li>Monthly inspection for damage and wear</li>
        <li>Quarterly professional assessment</li>
      </ul>
      
      <h3>Tip 2: Use Appropriate Cleaning Products</h3>
      <p>Select cleaning products based on your floor type and contaminants:</p>
      <ul>
        <li>pH-neutral cleaners for most applications</li>
        <li>Specialized cleaners for oil and grease removal</li>
        <li>Anti-slip treatments where needed</li>
        <li>Sealers and coatings for protection</li>
      </ul>
      
      <h3>Tip 3: Preventative Maintenance</h3>
      <p>Implement preventative measures to avoid costly repairs:</p>
      <ul>
        <li>Install entrance mats to reduce dirt tracking</li>
        <li>Use appropriate equipment pads and wheels</li>
        <li>Mark and protect high-traffic areas</li>
        <li>Regular sealant reapplication</li>
      </ul>
      
      <h3>Tip 4: Safety Considerations</h3>
      <p>Maintain safety standards through proper floor care:</p>
      <ul>
        <li>Keep floors dry and slip-resistant</li>
        <li>Repair cracks and damage promptly</li>
        <li>Ensure proper lighting in all areas</li>
        <li>Mark hazardous areas clearly</li>
      </ul>
      
      <h3>Tip 5: Professional Assessment</h3>
      <p>Regular professional evaluation helps identify issues early and plan maintenance effectively.</p>
      
      <p>Following these maintenance tips will ensure your industrial floors remain safe, functional, and cost-effective for years to come.</p>
    `,
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
    content: `
      <p>Marble is a beautiful and luxurious natural stone that requires special care to maintain its appearance and longevity. Understanding proper marble maintenance is essential for preserving its beauty.</p>
      
      <h3>Understanding Marble</h3>
      <p>Marble is a porous, calcium-based stone that can be easily damaged by acids, scratches, and improper cleaning methods. Its unique characteristics require specific care approaches.</p>
      
      <h3>Daily Cleaning Routine</h3>
      <ul>
        <li>Use pH-neutral cleaners specifically designed for marble</li>
        <li>Wipe spills immediately to prevent staining</li>
        <li>Use soft, non-abrasive cloths</li>
        <li>Avoid vinegar, lemon juice, and other acidic cleaners</li>
      </ul>
      
      <h3>Sealing and Protection</h3>
      <p>Regular sealing is crucial for marble protection:</p>
      <ol>
        <li>Test current sealant effectiveness</li>
        <li>Clean surface thoroughly before sealing</li>
        <li>Apply appropriate sealant for your marble type</li>
        <li>Allow proper curing time</li>
        <li>Reapply as recommended by manufacturer</li>
      </ol>
      
      <h3>Preventing Damage</h3>
      <ul>
        <li>Use coasters under glasses and bottles</li>
        <li>Place mats under heavy objects</li>
        <li>Avoid dragging items across marble surfaces</li>
        <li>Use cutting boards in kitchen areas</li>
      </ul>
      
      <h3>Professional Maintenance</h3>
      <p>Consider professional services for:</p>
      <ul>
        <li>Deep cleaning and restoration</li>
        <li>Stain removal</li>
        <li>Polishing and refinishing</li>
        <li>Structural repairs</li>
      </ul>
      
      <p>With proper care and maintenance, your marble surfaces will retain their beauty and value for generations.</p>
    `,
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
    content: `
      <p>Selecting the right tile adhesive is crucial for successful tile installation. The wrong adhesive can lead to tile failure, costly repairs, and safety hazards.</p>
      
      <h3>Types of Tile Adhesives</h3>
      
      <h4>Cement-Based Adhesives</h4>
      <p>Traditional cement-based adhesives are versatile and cost-effective. They're suitable for most interior applications and various tile types.</p>
      
      <h4>Epoxy Adhesives</h4>
      <p>Epoxy adhesives offer superior strength and chemical resistance. They're ideal for commercial applications and areas with high moisture or chemical exposure.</p>
      
      <h4>Modified Adhesives</h4>
      <p>Modified adhesives combine cement with polymers for enhanced performance. They offer better flexibility and adhesion than standard cement adhesives.</p>
      
      <h3>Selection Factors</h3>
      <ul>
        <li><strong>Tile Type:</strong> Porcelain, ceramic, natural stone, glass</li>
        <li><strong>Substrate:</strong> Concrete, wood, existing tile</li>
        <li><strong>Environment:</strong> Interior/exterior, wet areas, temperature extremes</li>
        <li><strong>Application:</strong> Floor, wall, ceiling, countertop</li>
      </ul>
      
      <h3>Application Considerations</h3>
      <p>Proper application is essential for adhesive performance:</p>
      <ul>
        <li>Ensure substrate is clean and properly prepared</li>
        <li>Follow manufacturer's mixing instructions</li>
        <li>Apply appropriate coverage rate</li>
        <li>Allow proper curing time</li>
      </ul>
      
      <h3>Professional Tips</h3>
      <ul>
        <li>Always read and follow manufacturer instructions</li>
        <li>Test adhesive on a small area first</li>
        <li>Consider environmental conditions during application</li>
        <li>Use appropriate tools for mixing and application</li>
      </ul>
      
      <p>Choosing the right adhesive ensures your tile installation will be durable, safe, and long-lasting.</p>
    `,
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
    content: `
      <p>Epoxy grout has revolutionized tile installation in commercial and industrial settings, offering unparalleled durability, stain resistance, and ease of maintenance compared to traditional cement-based grouts.</p>
      
      <h3>Superior Durability</h3>
      <p>Epoxy grout's exceptional strength makes it ideal for high-traffic areas:</p>
      <ul>
        <li>Resistant to cracking and shrinking</li>
        <li>Withstands heavy loads and impact</li>
        <li>Maintains integrity in extreme temperatures</li>
        <li>Long-lasting performance in harsh environments</li>
      </ul>
      
      <h3>Stain and Chemical Resistance</h3>
      <p>Unlike traditional grouts, epoxy grout is virtually impervious to:</p>
      <ul>
        <li>Acids, alkalis, and harsh chemicals</li>
        <li>Oil, grease, and food stains</li>
        <li>Mold and mildew growth</li>
        <li>Color fading from UV exposure</li>
      </ul>
      
      <h3>Hygiene and Safety</h3>
      <p>Epoxy grout contributes to better hygiene standards:</p>
      <ul>
        <li>Non-porous surface prevents bacterial growth</li>
        <li>Easy to clean and sanitize</li>
        <li>Maintains slip resistance</li>
        <li>Ideal for food service and healthcare facilities</li>
      </ul>
      
      <h3>Cost-Effectiveness</h3>
      <p>While initially more expensive, epoxy grout offers long-term savings:</p>
      <ul>
        <li>Reduced maintenance costs</li>
        <li>Longer service life</li>
        <li>Lower cleaning requirements</li>
        <li>Minimal repair and replacement needs</li>
      </ul>
      
      <h3>Application Considerations</h3>
      <p>Professional installation is crucial for optimal performance:</p>
      <ul>
        <li>Requires precise mixing and application</li>
        <li>Needs proper surface preparation</li>
        <li>Temperature and humidity control important</li>
        <li>Skilled installers recommended</li>
      </ul>
      
      <p>For commercial applications where durability and hygiene are paramount, epoxy grout represents the gold standard in tile installation.</p>
    `,
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
    content: `
      <p>Natural stone surfaces require specialized care to maintain their beauty and longevity. Understanding the right products and techniques is essential for proper stone maintenance.</p>
      
      <h3>Cleaning Products</h3>
      <p>Choose appropriate cleaners based on stone type and condition:</p>
      <ul>
        <li><strong>pH-neutral cleaners:</strong> Safe for all stone types</li>
        <li><strong>Stone-specific cleaners:</strong> Formulated for particular stone varieties</li>
        <li><strong>Deep cleaning solutions:</strong> For removing embedded dirt and stains</li>
        <li><strong>Gentle daily cleaners:</strong> For routine maintenance</li>
      </ul>
      
      <h3>Sealing Products</h3>
      <p>Proper sealing is crucial for stone protection:</p>
      <ul>
        <li><strong>Penetrating sealers:</strong> Absorb into stone pores</li>
        <li><strong>Topical sealers:</strong> Create protective surface coating</li>
        <li><strong>Enhancer sealers:</strong> Improve color and appearance</li>
        <li><strong>Specialty sealers:</strong> For specific applications and environments</li>
      </ul>
      
      <h3>Polishing and Restoration</h3>
      <p>Maintain stone beauty with proper polishing:</p>
      <ul>
        <li><strong>Diamond polishing pads:</strong> For professional restoration</li>
        <li><strong>Polishing compounds:</strong> For maintaining shine</li>
        <li><strong>Crystallization products:</strong> For high-gloss finishes</li>
        <li><strong>Honing products:</strong> For matte finishes</li>
      </ul>
      
      <h3>Stain Removal</h3>
      <p>Address stains promptly with appropriate products:</p>
      <ul>
        <li><strong>Oil-based stain removers:</strong> For grease and oil stains</li>
        <li><strong>Rust removers:</strong> For iron and metal stains</li>
        <li><strong>Organic stain removers:</strong> For food and beverage stains</li>
        <li><strong>Poultice treatments:</strong> For deep-set stains</li>
      </ul>
      
      <h3>Preventive Maintenance</h3>
      <p>Regular maintenance prevents costly repairs:</p>
      <ul>
        <li>Daily cleaning with appropriate products</li>
        <li>Regular sealing applications</li>
        <li>Prompt stain treatment</li>
        <li>Professional assessment annually</li>
      </ul>
      
      <p>Using the right products and techniques ensures your natural stone surfaces remain beautiful and functional for years to come.</p>
    `,
    author: 'Wilber Technical Team',
    date: '2025-02-10',
    category: 'Stone Care',
    image: 'assets/images/resource/news-2.jpg',
    readTime: '5 min read',
    tags: ['stone care', 'maintenance', 'products', 'natural stone']
  }
];

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private title = inject(Title);
  private meta = inject(Meta);
  private blogDataService = inject(BlogDataService);
  private sanitizer = inject(DomSanitizer);

  blogPost: BlogPost | null = null;
  relatedPosts: BlogPost[] = [];
  externalContent: SafeHtml | null = null;
  loadingExternalContent = false;
  errorLoadingContent = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.blogPost = BLOG_POSTS.find(post => post.slug === slug) || null;
      
      if (this.blogPost) {
        this.setMetaTags();
        this.getRelatedPosts();
        this.loadExternalContent();
      } else {
        this.router.navigate(['/blogs']);
      }
    });
  }

  private loadExternalContent() {
    if (this.blogPost && this.blogPost.externalUrl) {
      this.loadingExternalContent = true;
      this.errorLoadingContent = false;
      
      this.blogDataService.getExternalContent(this.blogPost.externalUrl).subscribe({
        next: (htmlContent: string) => {
          // Sanitize the HTML content for security
          this.externalContent = this.sanitizer.bypassSecurityTrustHtml(htmlContent);
          this.loadingExternalContent = false;
        },
        error: (error) => {
          console.error('Error loading external content:', error);
          this.errorLoadingContent = true;
          this.loadingExternalContent = false;
        }
      });
    }
  }

  private setMetaTags() {
    if (this.blogPost) {
      this.title.setTitle(`${this.blogPost.title} - Wilber`);
      this.meta.updateTag({ name: 'description', content: this.blogPost.excerpt });
      this.meta.updateTag({ property: 'og:title', content: this.blogPost.title });
      this.meta.updateTag({ property: 'og:description', content: this.blogPost.excerpt });
      this.meta.updateTag({ property: 'og:image', content: this.blogPost.image });
      this.meta.updateTag({ name: 'keywords', content: this.blogPost.tags.join(', ') });
    }
  }

  private getRelatedPosts() {
    if (this.blogPost) {
      // Get all posts except the current one, then take the first 3
      this.relatedPosts = BLOG_POSTS
        .filter(post => post.id !== this.blogPost!.id)
        .slice(0, 3);
      
      // Ensure we have at least 3 related posts
      if (this.relatedPosts.length < 3) {
        // If we don't have enough posts, add more from the same category first, then others
        const sameCategoryPosts = BLOG_POSTS
          .filter(post => post.id !== this.blogPost!.id && post.category === this.blogPost!.category)
          .slice(0, 3 - this.relatedPosts.length);
        
        this.relatedPosts = [...this.relatedPosts, ...sameCategoryPosts];
        
        // If still not enough, add any remaining posts
        if (this.relatedPosts.length < 3) {
          const remainingPosts = BLOG_POSTS
            .filter(post => post.id !== this.blogPost!.id && !this.relatedPosts.find(rp => rp.id === post.id))
            .slice(0, 3 - this.relatedPosts.length);
          
          this.relatedPosts = [...this.relatedPosts, ...remainingPosts];
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // Initialize Swiper slider
    this.initializeSwiper();
    
    // Initialize back to top functionality
    this.initializeBackToTop();
  }

  private initializeSwiper(): void {
    // Check if Swiper is available
    if (typeof (window as any).Swiper !== 'undefined') {
      const blogSlider = new (window as any).Swiper('.blog-slider', {
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

  private initializeBackToTop(): void {
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
  }
} 