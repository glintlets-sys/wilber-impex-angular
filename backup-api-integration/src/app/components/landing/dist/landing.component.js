"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LandingComponent = void 0;
var core_1 = require("@angular/core");
var swiper_1 = require("swiper");
var bundle_1 = require("swiper/element/bundle");
//import noUiSlider from "nouislider";
var LandingComponent = /** @class */ (function () {
    function LandingComponent(router, recommendations, route, blogDataService, loadingOverlayService, categoryService, catalogService) {
        //this.loadingOverlayService.showLoadingOverlay("Loading your catalog Items", 5000);
        //this.toasterService.showToast('Welcome to Glint Toy Shop! Thanks for visiting us. Please login to help us serve you better. And also avail latest offers!', ToastType.None, 2000);
        this.router = router;
        this.recommendations = recommendations;
        this.route = route;
        this.blogDataService = blogDataService;
        this.loadingOverlayService = loadingOverlayService;
        this.categoryService = categoryService;
        this.catalogService = catalogService;
        this.autoclose = false;
        this.customOptionsLanding1 = {
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
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayspeed: 1000,
            autoplayHoverPause: true
        };
        this.customOptionsLanding = {
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
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayspeed: 1000,
            autoplayHoverPause: true
        };
        this.customOptions = {
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
        };
        this.customOptionsCategory = {
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            dots: false,
            slideBy: 3,
            navSpeed: 500,
            navText: ['', ''],
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
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
        this.parentScrollThresholdAboveForCategories = 200; // Set the value for above
        this.parentScrollThresholdBelowForCategories = 150;
        this.allCategories = [];
        this.played = false;
    }
    LandingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.recommendations.getRecommendedBlogs(0).subscribe(function (val) {
            _this.blogRecommendations = val;
        });
        this.catalogService.selectedAgeRange$.next(null);
        this.loadCategories();
    };
    LandingComponent.prototype.loadCategories = function () {
        var _this = this;
        // fetch all categories from category service. 
        this.categoryService.categories$.subscribe(function (value) {
            _this.allCategories = value;
        });
    };
    LandingComponent.prototype.navigateToBlog = function (blogId) {
        this.router.navigate(['blog', blogId]); // Navigate to the 'blog' route with the specified 'blogId'
    };
    LandingComponent.prototype.ngAfterViewInit = function () {
        // this.videoPlayer.nativeElement.play();
        bundle_1.register();
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
        new swiper_1["default"](".trendingswiper", {
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
    };
    LandingComponent.prototype.play = function () {
        // this.videoPlayer.nativeElement.play();
    };
    LandingComponent.prototype.navigateToMore = function (category) {
        this.router.navigate(["categoryItems/" + category.id]);
    };
    __decorate([
        core_1.ViewChild('videoPlayer')
    ], LandingComponent.prototype, "videoPlayer");
    __decorate([
        core_1.ViewChild('trendingswiper')
    ], LandingComponent.prototype, "trendingswiper");
    __decorate([
        core_1.ViewChild('brand-partner')
    ], LandingComponent.prototype, "brandPartner");
    __decorate([
        core_1.ViewChild('our-clint-review')
    ], LandingComponent.prototype, "ourClintReview");
    LandingComponent = __decorate([
        core_1.Component({
            selector: 'app-landing',
            templateUrl: './landing.component.html',
            styleUrls: ['./landing.component.scss']
        })
    ], LandingComponent);
    return LandingComponent;
}());
exports.LandingComponent = LandingComponent;
