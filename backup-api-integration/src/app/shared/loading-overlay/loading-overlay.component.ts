import { Component, OnInit } from '@angular/core';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';


@Component({
  selector: 'app-loading-overlay',
  template: `
    <div *ngIf="isLoading" class="loading-overlay">
  <div class="loading-spinner">
    <img src="assets/img/brand/favicon/android-chrome-192x192.png" alt="Logo" class="logo-rotate">
  </div>
</div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loading-spinner {
      animation: rotate 2.0s linear infinite;
    }

    @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
    }

    .logo-rotate {
      width: 80px; /* Adjust the width as needed */
      height: 70px;
    }
    .loading-message {
      background-color: #fff;
      padding: 20px;
      border-radius: 4px;
    }
  `]
})
export class LoadingOverlayComponent implements OnInit {
  isLoading: boolean = false;
  message: string = '';

  constructor(private loadingOverlayService: LoadingOverlayService) {}

  ngOnInit() {
    this.loadingOverlayService.loadingState$.subscribe((loadingState) => {
      this.isLoading = loadingState.isLoading;
      this.message = loadingState.message;
    });
  }
}
