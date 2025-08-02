import { Component, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  template: `
    <a href="javascript:;" class="btn btn-primary btn-round btn-icon btn-back" (click)="goBack()" [ngClass]="{ 'd-none': !showButton }">
      <span class="btn-inner--icon"><i class="ni ni-bold-left"></i></span>
    </a>
  `,
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent {
  showButton: boolean = false;

  constructor(private location: Location) {}

  /*
  @HostListener('window:popstate', [])
  onPopState() {
    this.showButton = this.location.path() !== '';
  }*/

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300;
  }

  goBack() {
    this.location.back();
  }
}
