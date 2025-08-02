import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Toy } from 'src/app/services/toy';
import Swiper from "swiper";
import Element from "swiper"
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss']
})
export class BundleComponent implements OnInit, AfterViewInit {

  normalBundles: Toy[] = [];
  buyTwoGetTwentyPercentBundle: Toy[] = [];
  greatDealBundle: Toy[] = [];

  @ViewChild('trendingswiper') trendingswiper: Element;
  swiperTrending: Swiper;

  constructor(private category_service: CategoryService, private router: Router) { }

  ngOnInit(): void { }

  fetchItemsByCategory(categoryId: number): Observable<any> {
    return this.category_service.getToysByCategoryId(categoryId);
  }

  ngAfterViewInit() {
    register();
    this.fetchItemsByCategory(107).subscribe((val: Toy[]) => {
      this.normalBundles = val;
      this.fetchItemsByCategory(108).subscribe((val: Toy[]) => {
        this.buyTwoGetTwentyPercentBundle = val;
        this.fetchItemsByCategory(109).subscribe((val: Toy[]) => {
          this.greatDealBundle = val;

          setTimeout(() => {
            this.initializeSwipers();
          }, 1000);
        })
      })
    })
  }

  initializeSwipers() {
    this.swiperTrending = new Swiper(".trendingswiper", {
      autoplay: {
        delay: 3000,
        // disableOnInteraction: true,
      },
      loop: true,
      // grabCursor: true,
      spaceBetween: 10,
      slidesPerGroup: 1,
      //navigation: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        300: {
          slidesPerView: 2,
        },
        430: {
          slidesPerView: 2,
        },
        798: {
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

    document.querySelector('.trendingswiper .swiper-button-next')?.addEventListener('OnChange', () => {
      if (this.swiperTrending) {
        this.swiperTrending.slideNext();
      }
    });

    document.querySelector('.trendingswiper .swiper-button-prev')?.addEventListener('OnChange', () => {
      if (this.swiperTrending) {
        this.swiperTrending.slidePrev();
      }
    });
  }

  navigateTocategory(message: string) {
    const bundleId = message === 'bundle' ? 107 : message === 'buyTwoGetTwenty' ? 108 : 109;
    this.router.navigate(['/categoryItems', bundleId])
  }

}
