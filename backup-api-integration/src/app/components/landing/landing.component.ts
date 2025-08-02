import { Component, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { Blog, BlogDataService } from 'src/app/services/blog-data.service';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Category } from 'src/app/services/category';
import { CategoryService } from 'src/app/services/category.service';
import Swiper from "swiper";
import Element from "swiper"
import { register } from 'swiper/element/bundle';
//import noUiSlider from "nouislider";


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit, OnDestroy {

  autoclose = false;

  customOptionsLanding1: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 500,
    slideBy: 1,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    // animateIn: 'fadeIn',
    //animateOut: 'fadeOut',
    autoplay: true, // Enable Autoplay
    autoplayTimeout: 5000, // Set the delay between transitions to 1 second
    autoplayspeed: 1000,

    autoplayHoverPause: true, // Pause on hover
  };

  customOptionsLanding: any = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 300,

    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    autoplay: true, // Enable Autoplay
    autoplayTimeout: 5000, // Set the delay between transitions to 1 second
    autoplayspeed: 1000,

    autoplayHoverPause: true, // Pause on hover
  };




  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: true
  }

  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    slideBy: 3,
    navSpeed: 500,
    navText: ['', ''],
    autoplay: true, // Enable Autoplay
    autoplayTimeout: 5000, // Set the delay between transitions to 1 second
    autoplayHoverPause: true, // Pause on hover
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      }
    },
    nav: false
  };



  parentScrollThresholdAboveForCategories: number = 200; // Set the value for above
  parentScrollThresholdBelowForCategories: number = 150;

  @ViewChild('videoPlayer') videoPlayer: any;
  @ViewChild('trendingswiper') trendingswiper: Element;
  @ViewChild('brand-partner') brandPartner: Element;
  @ViewChild('our-clint-review') ourClintReview: Element;

  constructor(private router: Router, private recommendations:
    RecommendationsTsService,
    private route: ActivatedRoute,
    private blogDataService: BlogDataService,
    private loadingOverlayService: LoadingOverlayService,
    private categoryService: CategoryService,
    private catalogService: CatalogService) {
    //this.loadingOverlayService.showLoadingOverlay("Loading your catalog Items", 5000);
    //this.toasterService.showToast('Welcome to Glint Toy Shop! Thanks for visiting us. Please login to help us serve you better. And also avail latest offers!', ToastType.None, 2000);

  }

  blogRecommendations: Blog[];
  ngOnInit(): void {
    this.recommendations.getRecommendedBlogs(0).subscribe(val => {
      this.blogRecommendations = val;
    })
    this.catalogService.selectedAgeRange$.next(null);
    this.loadCategories();
  }




  allCategories: Category[] = [];
  public loadCategories() {
    // fetch all categories from category service. 
    this.categoryService.categories$.subscribe((value: Category[]) => {
      this.allCategories = value;
    });
  }

  navigateToBlog(blogId: number) {
    this.router.navigate(['blog', blogId]); // Navigate to the 'blog' route with the specified 'blogId'
  }


  ngAfterViewInit() {
    // this.videoPlayer.nativeElement.play();

    register();

    new Swiper(".mySwiper", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,

      grabCursor: true,
    });
    new Swiper(".mySwiper2", {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 2000,
        // disableOnInteraction: true,
      },
      loop: true,
      grabCursor: true,
      thumbs: {
        // swiper: swiper,
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 1,
        },
        991: {
          slidesPerView: 1,
        },

      },
    });


    new Swiper(".trendingswiper", {
      autoplay: {
        delay: 2000,
        // disableOnInteraction: true,
      },
      loop: true,
      //   grabCursor: true,
      spaceBetween: 10,

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1100: {
          slidesPerView: 4,
        }
      },
    });




    new Swiper(".brand-partner", {
      autoplay: {
        delay: 2000,
        // disableOnInteraction: true,
      },
      loop: true,
      grabCursor: true,
      spaceBetween: 10,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        300: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 3,
        },
        1100: {
          slidesPerView: 3,
        },

      },
    });


    new Swiper(".our-clint-review", {
      autoplay: {
        delay: 1500,
        // disableOnInteraction: true,
      },
      loop: true,
      grabCursor: true,
      spaceBetween: 10,

      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
        1100: {
          slidesPerView: 3,
        },

      },
    });


  }

  play() {
    // this.videoPlayer.nativeElement.play();
  }

  played: boolean = false;

  navigateToMore(category) {
    this.router.navigate([`categoryItems/${category.id}`]);
  }
  
  ngOnDestroy(): void {
    localStorage.removeItem("breadCrumbUrl")
  }
}
