import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  toastMessage: string;
  isToastVisible: boolean;
  showAlert = true;
  showNavbarAndFooter: boolean = true;

  constructor(public router: Router, private activatedRoute: ActivatedRoute) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbarAndFooter = !event.urlAfterRedirects.includes('/admin');
      if (event.urlAfterRedirects.includes('/invoice')) {
        this.showNavbarAndFooter = false
      }
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const firstChild = this.activatedRoute.firstChild;
      if (firstChild.component) {
        this.showNavbarAndFooter = false
      }
    });
  }

  closeAlert() {
    this.showAlert = false;
  }


}
