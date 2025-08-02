import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-top-button',
  template: `
    <a href="javascript:;" class="btn btn-danger btn-round btn-icon btn-scroll-top" (click)="scrollToTop()" [ngClass]="{ 'd-none': !showButton }">
      <span class="btn-inner--icon"><i class="ni ni-bold-up"></i></span>
    </a>
  `,
  styleUrls: ['./scroll-top-button.component.scss']
})
export class ScrollTopButtonComponent {
  showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300;
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }
}