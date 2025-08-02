import { Component, OnInit,ViewChild, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogService } from 'src/app/services/catalog.service';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import { Toy } from 'src/app/services/toy';
import Swiper from "swiper";
import Element from "swiper"
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-top-categories',
  templateUrl: './top-categories.component.html',
  styleUrls: ['./top-categories.component.scss']
})
export class TopCategoriesComponent implements OnInit, AfterViewInit {

  topCategories: any[] = [];

  @Input()
  categoryId: number;

  @ViewChild('trendingswiper3') trendingswiper: Element;
 
  constructor(private loadingService: LoadingOverlayService,
    private category_service: CategoryService) { 
     
     }

     fetchItemsByCategory(categoryId: number): Observable<any> {
      return  this.category_service.getToysByCategoryId(categoryId);
    }

     ngOnInit(): void {
      this.fetchItemsByCategory(this.categoryId).subscribe((val: Toy[])=>{
        this.topCategories = val;
       })
     }

     ngAfterViewInit() {
        // this.videoPlayer.nativeElement.play();
        register();
        setTimeout(()=>{
          console.log("in ng After view INiit");
          this.initializeSwipers(); 
        },2000)
        
      }
    
      initializeSwipers() {
        
        let swiperTrending: Swiper = new Swiper(".trendingswiper3", {
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
              slidesPerView: 2,
              grid: {
                rows: 2, // Number of rows
                fill: 'row', // Fill method ('row' or 'column')
              },
            },
            768: {
              slidesPerView: 2,
              grid: {
                rows: 2, // Number of rows
                fill: 'row', // Fill method ('row' or 'column')
              },
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
    
        document.querySelector('.swiper-button-next').addEventListener('click', () => {
          if(swiperTrending){
            swiperTrending.slideNext();
    
          }
        });
        document.querySelector('.swiper-button-prev').addEventListener('click', () => {
          if(swiperTrending){
            swiperTrending.slidePrev();
          }
        });
    
      }
}
