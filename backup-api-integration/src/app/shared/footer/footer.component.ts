import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent  {

  isCollapsed = true;
  isCollapsed1 = true;
  isCollapsed2 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;

  date: Date = new Date();
  constructor(private router: Router) { }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit() { }

  navigateToURL(url) {
    window.open(url, '_blank');
  }

  openLogo(ClientID: string): void {
    const attributes = 'toolbar=0,location=0,directories=0,status=0, menubar=0,scrollbars=1,resizable=1,width=550,height=600,left=0,top=0';
    window.open('http://www.ccavenue.com/verifySeal.jsp?ClientID=' + ClientID, 'win', attributes);
  }

  navigateToOrder() {
    this.router.navigate(['/myaccount/orderHistory']);
  }



}
