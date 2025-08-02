"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CarouselModalComponent = void 0;
var core_1 = require("@angular/core");
var CarouselModalComponent = /** @class */ (function () {
    function CarouselModalComponent(activeModal) {
        this.activeModal = activeModal;
        this.modalHeight = '100vh'; // Set the initial height of the modal to the viewport height
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.currentSlideIndex = 0; // Custom variable to keep track of the current slide index
    } // Replace NgbActiveModal with the active modal service you are using in Argon
    CarouselModalComponent.prototype.closeModal = function () {
        this.activeModal.close();
    };
    CarouselModalComponent.prototype.updateModalHeight = function (slideIndex) {
        var carouselImages = document.querySelectorAll('.modal .modal-body .d-block');
        if (carouselImages[slideIndex]) {
            this.modalHeight = carouselImages[slideIndex].clientHeight + 'px';
        }
    };
    CarouselModalComponent.prototype.onTouchStart = function (event) {
        this.touchStartX = event.touches[0].clientX;
    };
    CarouselModalComponent.prototype.onTouchMove = function (event) {
        this.touchEndX = event.touches[0].clientX;
    };
    CarouselModalComponent.prototype.onTouchEnd = function () {
        var touchDiff = this.touchStartX - this.touchEndX;
        if (touchDiff > 50 && this.currentSlideIndex < this.photoLinks.length - 1) {
            this.currentSlideIndex++; // Move to the next slide
            this.carousel.activeSlide = this.currentSlideIndex; // Update the active slide index in the carousel
        }
        else if (touchDiff < -50 && this.currentSlideIndex > 0) {
            this.currentSlideIndex--; // Move to the previous slide
            this.carousel.activeSlide = this.currentSlideIndex; // Update the active slide index in the carousel
        }
    };
    __decorate([
        core_1.Input()
    ], CarouselModalComponent.prototype, "photoLinks");
    __decorate([
        core_1.Input()
    ], CarouselModalComponent.prototype, "title");
    __decorate([
        core_1.ViewChild('carousel', { static: false })
    ], CarouselModalComponent.prototype, "carousel");
    CarouselModalComponent = __decorate([
        core_1.Component({
            selector: 'app-carousel-modal',
            templateUrl: './carousel-modal.component.html',
            styleUrls: ['./carousel-modal.component.scss']
        })
    ], CarouselModalComponent);
    return CarouselModalComponent;
}());
exports.CarouselModalComponent = CarouselModalComponent;
