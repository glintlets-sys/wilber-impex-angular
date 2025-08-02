import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-whatsapp-widget',
  template: `
    <a href="https://api.whatsapp.com/send?phone=+919742206373&text=Hello%2C%20I%20have%20a%20question%20for%20you!"
       target="_blank"
       rel="noopener"
       class="btn btn-round btn-icon bg-success text-white whatsapp-button" [ngClass]="{ 'd-none': !showButton }">
       <span class="btn-inner--icon"><i class="fab fa-whatsapp"></i></span>
    </a>
  `,
  styleUrls: ['./whatsapp-widget.component.scss']
})
export class WhatsappWidgetComponent implements OnInit {
  showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300;
  }

  constructor() { }

  ngOnInit(): void {
    // You can add any additional initialization code here if needed.
  }

}