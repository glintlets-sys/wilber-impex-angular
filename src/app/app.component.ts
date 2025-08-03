import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToyTestService } from './services/toy-test.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private toyTestService: ToyTestService) {}

  ngOnInit() {
    // Subscribe to router events to scroll to top on navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });

    // Test toy service data availability
    this.testToyService();
  }

  private scrollToTop(): void {
    // Use smooth scrolling if supported, otherwise instant scroll
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }

  // Method to test toy service
  private testToyService(): void {
    console.log('🚀 [APP] Initializing toy service test...');
    // Delay the test to ensure the app is fully loaded
    setTimeout(() => {
      this.toyTestService.testToyService();
    }, 1000);
  }
}
