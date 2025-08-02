"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CatalogItemsComponent = void 0;
var core_1 = require("@angular/core");
var swiper_1 = require("swiper");
var bundle_1 = require("swiper/element/bundle");
var CatalogItemsComponent = /** @class */ (function () {
    function CatalogItemsComponent(loadingService, catalogService, recommendationsService) {
        var _this = this;
        this.loadingService = loadingService;
        this.catalogService = catalogService;
        this.recommendationsService = recommendationsService;
        this.isLoading = true;
        this.activeTab = 'featured';
        this.featuredItems = [];
        this.latestItems = [];
        this.bestSellers = [];
        this.customOptions = {
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: true,
            dots: false,
            slideBy: 2,
            navSpeed: 500,
            navText: ['', ''],
            margin: 10,
            autoplay: true,
            responsive: {
                0: {
                    items: 2,
                    rows: 2
                },
                400: {
                    items: 2,
                    rows: 2
                },
                740: {
                    items: 4,
                    rows: 2
                },
                940: {
                    items: 4,
                    rows: 2
                }
            },
            nav: true
        };
        this.loadingService.showLoadingOverlay("loading", 4000);
        this.catalogService.getFeaturedList().subscribe(function (data) {
            _this.featuredItems = data;
            //this.featuredItems = [1,2,3,4,5];
            _this.loadingService.hideLoadingOverlay();
        });
        this.loadingService.showLoadingOverlay("loading", 4000);
        this.catalogService.getLatestList().subscribe(function (data) {
            _this.latestItems = data;
            _this.loadingService.hideLoadingOverlay();
        });
        this.loadingService.showLoadingOverlay("loading", 4000);
        this.catalogService.getBestSellerList().subscribe(function (data) {
            _this.bestSellers = data;
            _this.loadingService.hideLoadingOverlay();
        });
    }
    CatalogItemsComponent.prototype.setActiveTab = function (tab) {
        this.activeTab = tab;
        console.log(this.activeTab);
    };
    CatalogItemsComponent.prototype.ngOnInit = function () {
        // setTimeout(() => {
        // Load initial items (4 or 5 items)
        //}, 1000);
        // Attach a scroll event listener to trigger loading more items
        //window.addEventListener('scroll', this.onScroll.bind(this));
    };
    CatalogItemsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // this.videoPlayer.nativeElement.play();
        bundle_1.register();
        setTimeout(function () {
            console.log("in ng After view INiit");
            _this.initializeSwipers();
        }, 2500);
    };
    CatalogItemsComponent.prototype.initializeSwipers = function () {
        new swiper_1["default"](".mySwiper", {
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
            grabCursor: true
        });
        new swiper_1["default"](".mySwiper2", {
            spaceBetween: 10,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            autoplay: {
                delay: 2000
            },
            loop: true,
            grabCursor: true,
            thumbs: {
            // swiper: swiper,
            },
            breakpoints: {
                300: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 1
                },
                991: {
                    slidesPerView: 1
                }
            }
        });
        var swiperTrending = new swiper_1["default"](".trendingswiper", {
            autoplay: {
                delay: 2000
            },
            loop: true,
            //   grabCursor: true,
            spaceBetween: 10,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {
                300: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 2
                },
                991: {
                    slidesPerView: 3
                },
                1100: {
                    slidesPerView: 4
                }
            }
        });
        new swiper_1["default"](".brand-partner", {
            autoplay: {
                delay: 2000
            },
            loop: true,
            grabCursor: true,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                300: {
                    slidesPerView: 2
                },
                768: {
                    slidesPerView: 3
                },
                991: {
                    slidesPerView: 4
                },
                1100: {
                    slidesPerView: 5
                }
            }
        });
        new swiper_1["default"](".our-clint-review", {
            autoplay: {
                delay: 1500
            },
            loop: true,
            grabCursor: true,
            spaceBetween: 10,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination'
            },
            breakpoints: {
                300: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 2
                },
                1100: {
                    slidesPerView: 3
                }
            }
        });
        document.querySelector('.swiper-button-next').addEventListener('click', function () {
            if (swiperTrending) {
                swiperTrending.slideNext();
            }
        });
        document.querySelector('.swiper-button-prev').addEventListener('click', function () {
            if (swiperTrending) {
                swiperTrending.slidePrev();
            }
        });
    };
    CatalogItemsComponent.prototype.hasTrendingProductsLoaded = function () {
        return (this.latestItems.length > 3) && (this.featuredItems.length > 3) && (this.bestSellers.length > 3);
    };
    CatalogItemsComponent.prototype.getCatalogItems = function () {
        console.log(JSON.stringify(this.items));
        return this.items;
        //return [];
    };
    CatalogItemsComponent.prototype.navigateToDetailsPage = function () {
    };
    __decorate([
        core_1.ViewChild('trendingswiper')
    ], CatalogItemsComponent.prototype, "trendingswiper");
    __decorate([
        core_1.ViewChild('brand-partner')
    ], CatalogItemsComponent.prototype, "brandPartner");
    __decorate([
        core_1.ViewChild('our-clint-review')
    ], CatalogItemsComponent.prototype, "ourClintReview");
    CatalogItemsComponent = __decorate([
        core_1.Component({
            selector: 'app-catalog-items',
            templateUrl: './catalog-items.component.html',
            styleUrls: ['./catalog-items.component.scss']
        })
    ], CatalogItemsComponent);
    return CatalogItemsComponent;
}());
exports.CatalogItemsComponent = CatalogItemsComponent;
