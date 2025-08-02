import { Component, Input, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent } from 'ngx-bootstrap/carousel'; // Import the CarouselComponent

@Component({
  selector: 'app-carousel-modal',
  templateUrl: './carousel-modal.component.html',
  styleUrls: ['./carousel-modal.component.scss'],
})
export class CarouselModalComponent {
  @Input() photoLinks: string[] | undefined;
  @Input() title: string | undefined;
  @ViewChild('carousel', { static: false }) carousel: CarouselComponent; // Reference to the carousel component
  modalHeight = '100vh'; // Set the initial height of the modal to the viewport height


  constructor(public activeModal: NgbActiveModal) {} // Replace NgbActiveModal with the active modal service you are using in Argon

  closeModal() {
    this.activeModal.close();
  }

  updateModalHeight(slideIndex: number) {
    const carouselImages = document.querySelectorAll('.modal .modal-body .d-block') as NodeListOf<HTMLImageElement>;
    if (carouselImages[slideIndex]) {
      this.modalHeight = carouselImages[slideIndex].clientHeight + 'px';
    }
  }
  touchStartX = 0;
  touchEndX = 0;
  currentSlideIndex = 0; // Custom variable to keep track of the current slide index


  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd() {
    const touchDiff = this.touchStartX - this.touchEndX;
    if (touchDiff > 50 && this.currentSlideIndex < this.photoLinks.length - 1) {
      this.currentSlideIndex++; // Move to the next slide
      this.carousel.activeSlide = this.currentSlideIndex; // Update the active slide index in the carousel
    } else if (touchDiff < -50 && this.currentSlideIndex > 0) {
      this.currentSlideIndex--; // Move to the previous slide
      this.carousel.activeSlide = this.currentSlideIndex; // Update the active slide index in the carousel
    }
  }
}
