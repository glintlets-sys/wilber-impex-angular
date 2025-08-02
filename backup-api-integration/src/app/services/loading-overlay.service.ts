import { Injectable } from '@angular/core';
import { Subject, timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private loadingSubject: Subject<{ isLoading: boolean; message: string }> = new Subject<{ isLoading: boolean; message: string }>();
  public loadingState$ = this.loadingSubject.asObservable();
  private hideOverlayTimer: Subscription;


  constructor(private toasterService:ToasterService)
  {

  }

  showLoadingOverlay(message: string = 'Loading...', duration: number =5000): void {
    this.loadingSubject.next({ isLoading: true, message });
    this.hideOverlayTimer = timer(duration).pipe(take(1)).subscribe(() => {
      this.hideLoadingOverlay();
      // this.toasterService.showToast('The application is taking longer than usual to respond.', ToastType.Warn, 3000); // Display toaster notification

    });
  }

  hideLoadingOverlay(): void {
    if (this.hideOverlayTimer && !this.hideOverlayTimer.closed) {
      this.hideOverlayTimer.unsubscribe();
    }
    this.loadingSubject.next({ isLoading: false, message: '' });
  }
}
