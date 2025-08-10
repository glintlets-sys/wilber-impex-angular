import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToasterService } from '../../shared-services/toaster.service';
import { Toast, ToastType } from '../../shared-services/toaster';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="currentToast">
      <div 
        class="toast show"
        [ngClass]="getToastClass(currentToast.type)"
        role="alert"
        aria-live="assertive"
        aria-atomic="true">
        <div class="toast-header">
          <i class="toast-icon" [ngClass]="getIconClass(currentToast.type)"></i>
          <strong class="toast-title">{{ getToastTitle(currentToast.type) }}</strong>
          <button type="button" class="btn-close" (click)="closeToast()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="toast-body">
          {{ currentToast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
      width: 100%;
    }

    .toast {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: none;
      overflow: hidden;
      animation: slideInRight 0.3s ease-out;
      opacity: 1;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast.fade-out {
      animation: slideOutRight 0.3s ease-in;
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .toast-header {
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      font-weight: 600;
    }

    .toast-body {
      padding: 16px;
      color: white;
      line-height: 1.5;
    }

    .toast-icon {
      font-size: 18px;
      margin-right: 8px;
      color: white;
    }

    .toast-title {
      flex: 1;
      color: white;
      font-size: 14px;
      font-weight: 600;
    }

    .btn-close {
      background: transparent;
      border: none;
      color: white;
      opacity: 0.8;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: opacity 0.2s;
    }

    .btn-close:hover {
      opacity: 1;
    }

    .btn-close i {
      font-size: 12px;
    }

    /* Toast Type Styles */
    .toast-success {
      background: linear-gradient(135deg, #28a745, #20c997);
    }

    .toast-danger {
      background: linear-gradient(135deg, #dc3545, #e74c3c);
    }

    .toast-warning {
      background: linear-gradient(135deg, #ffc107, #fd7e14);
    }

    .toast-info {
      background: linear-gradient(135deg, #17a2b8, #007bff);
    }

    .toast-dark {
      background: linear-gradient(135deg, #343a40, #495057);
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .toast-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
      
      .toast {
        margin: 0;
      }
    }
  `]
})
export class ToasterComponent implements OnInit, OnDestroy {
  currentToast: Toast | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private toasterService: ToasterService) {}

  ngOnInit(): void {
    this.subscription = this.toasterService.toast$.subscribe(toast => {
      this.currentToast = toast;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getToastClass(type: ToastType): string {
    switch (type) {
      case ToastType.Success:
        return 'toast-success';
      case ToastType.Error:
        return 'toast-danger';
      case ToastType.Warn:
        return 'toast-warning';
      case ToastType.Info:
        return 'toast-info';
      case ToastType.None:
      default:
        return 'toast-dark';
    }
  }

  getIconClass(type: ToastType): string {
    switch (type) {
      case ToastType.Success:
        return 'fas fa-check-circle';
      case ToastType.Error:
        return 'fas fa-exclamation-circle';
      case ToastType.Warn:
        return 'fas fa-exclamation-triangle';
      case ToastType.Info:
        return 'fas fa-info-circle';
      case ToastType.None:
      default:
        return 'fas fa-bell';
    }
  }

  getToastTitle(type: ToastType): string {
    switch (type) {
      case ToastType.Success:
        return 'Success';
      case ToastType.Error:
        return 'Error';
      case ToastType.Warn:
        return 'Warning';
      case ToastType.Info:
        return 'Information';
      case ToastType.None:
      default:
        return 'Notification';
    }
  }

  closeToast(): void {
    this.toasterService.clearToast();
  }
}