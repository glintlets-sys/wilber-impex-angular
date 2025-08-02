"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TopCategoriesComponent = void 0;
var core_1 = require("@angular/core");
var swiper_1 = require("swiper");
var bundle_1 = require("swiper/element/bundle");
var TopCategoriesComponent = /** @class */ (function () {
    function TopCategoriesComponent(loadingService, catalogService, recommendationsService) {
        var _this = this;
        this.loadingService = loadingService;
        this.catalogService = catalogService;
        this.recommendationsService = recommendationsService;
        this.topCategories = [];
        this.loadingService.showLoadingOverlay("loading", 4000);
        this.catalogService.getFeaturedList().subscribe(function (data) {
            _this.topCategories = data;
            _this.loadingService.hideLoadingOverlay();
        });
    }
    TopCategoriesComponent.prototype.ngOnInit = function () {
    };
    TopCategoriesComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // this.videoPlayer.nativeElement.play();
        bundle_1.register();
        setTimeout(function () {
            console.log("in ng After view INiit");
            _this.initializeSwipers();
        }, 2000);
    };
    TopCategoriesComponent.prototype.initializeSwipers = function () {
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
    __decorate([
        core_1.ViewChild('trendingswiper')
    ], TopCategoriesComponent.prototype, "trendingswiper");
    TopCategoriesComponent = __decorate([
        core_1.Component({
            selector: 'app-top-categories',
            templateUrl: './top-categories.component.html',
            styleUrls: ['./top-categories.component.scss']
        })
    ], TopCategoriesComponent);
    return TopCategoriesComponent;
}());
exports.TopCategoriesComponent = TopCategoriesComponent;
