import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-scrolling-text',
  templateUrl: './scrolling-text.component.html',
  styleUrls: ['./scrolling-text.component.scss'],
  animations: [
    trigger('scrollAnimation', [
      state('scrolling', style({
        transform: 'translateX(-100%)'
      })),
      transition('* => scrolling', [
        style({ transform: 'translateX(100%)' }),
        animate('15s linear')
      ]),
    ])
  ]
})
export class ScrollingTextComponent implements OnInit {
  ngOnInit() {
    setInterval(() => {
      this.startScrollAnimation();
    }, 5000);
  }

  startScrollAnimation() {
    setTimeout(() => {
      this.scrollAnimation = 'scrolling';
    }, 0);
  }

  scrollAnimation = '';

  onAnimationEnd(event: any) {
    this.scrollAnimation = '';
  }
}
