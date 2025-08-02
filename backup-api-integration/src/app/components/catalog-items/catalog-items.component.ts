import { Component, OnInit, ViewChild, AfterViewInit, Input, ɵɵNgOnChangesFeature } from '@angular/core';
import { CatalogService } from 'src/app/services/catalog.service';
import { CategoryService } from 'src/app/services/category.service';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';
import { RecommendationsTsService } from 'src/app/services/recommendations.ts.service';
import Swiper from "swiper";
import Element from "swiper"
import { register } from 'swiper/element/bundle';
import SwiperCore from 'swiper';
import Navigation from 'swiper';
import Pagination from 'swiper';
import Scrollbar from 'swiper';
import A11y from 'swiper';
import { OnChange } from 'ngx-bootstrap/utils';
import { Observable } from 'rxjs';
import { Toy } from 'src/app/services/toy';

// install Swiper modules
//SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


@Component({
  selector: 'app-catalog-items',
  templateUrl: './catalog-items.component.html',
  styleUrls: ['./catalog-items.component.scss']
})
export class CatalogItemsComponent implements OnInit, AfterViewInit {




  allItems: any[];
  visibleItems: any[];
  isLoading: boolean = true;
  activeTab: string = 'featured';
  featuredItems: Toy[] = [];
  latestItems: Toy[] = [];
  bestSellers: Toy[] = [];

 
  @ViewChild('trendingswiper2') trendingswiper: Element;
  @ViewChild('brand-partner') brandPartner: Element;
  @ViewChild('our-clint-review') ourClintReview: Element;

  constructor(private loadingService: LoadingOverlayService,
    private catalogService: CatalogService,
    private recommendationsService: RecommendationsTsService,
    private category_service: CategoryService) {
  }

  ngOnInit(): void {

   
    
    


    
  }
  
  fetchItemsByCategory(categoryId: number): Observable<any> {
    return  this.category_service.getToysByCategoryId(categoryId);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngAfterViewInit() {
    // this.videoPlayer.nativeElement.play();
    register();
    this.fetchItemsByCategory(13).subscribe((val: Toy[])=>{
      this.featuredItems = val;
      //console.log(JSON.stringify(this.featuredItems));
      this.fetchItemsByCategory(12).subscribe((val: Toy[])=>{
        this.latestItems = val;
        this.fetchItemsByCategory(14).subscribe((val: Toy[])=>{
          this.bestSellers = val;
          this.initializeSwipers();
        })
      })
    })
    
  }

  swiperTrending: Swiper;
  
  initializeSwipers() {
  

    this.swiperTrending = new Swiper(".trendingswiper2", {
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
          grid: {
            rows: 2, // Number of rows
            fill: 'row', // Fill method ('row' or 'column')
          },
        },
        430: {
          slidesPerView: 2,
          grid: {
            rows: 2, // Number of rows
            fill: 'row', // Fill method ('row' or 'column')
          },
        },
        798: {
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
   
  //  this.trendingswiper.autoplay.start();

     document.querySelector('.trendingswiper2 .swiper-button-next').addEventListener('OnChange', () => {
      console.log("reached on change");
      if (this.swiperTrending) {
        this.swiperTrending.slideNext();
        //this.swiperTrending.update();
     //   this.swiperTrending.autoplay.stop();
        
      }
    });

    document.querySelector('.trendingswiper2 .swiper-button-prev').addEventListener('OnChange', () => {
      console.log("reached on change");
      if (this.swiperTrending) {
        this.swiperTrending.slidePrev();
      //  this.swiperTrending.update();
      //  this.swiperTrending.autoplay.stop();
      }
    }); 
  }

  hasTrendingProductsLoaded() {
    return (this.latestItems.length > 3) && (this.featuredItems.length > 3) && (this.bestSellers.length > 3);
  }

  public items: any[];
  getCatalogItems() {
    return this.items;
  }

  navigateToDetailsPage() {
  }

}
