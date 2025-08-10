import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../shared-services/toaster.service';
import { ToastType } from '../../shared-services/toaster';

@Component({
  selector: 'app-toaster-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toaster-test-container">
      <h3>Test Toaster Component</h3>
      <div class="button-group">
        <button class="btn btn-success" (click)="showSuccess()">
          <i class="fas fa-check"></i> Success Toast
        </button>
        <button class="btn btn-danger" (click)="showError()">
          <i class="fas fa-times"></i> Error Toast
        </button>
        <button class="btn btn-warning" (click)="showWarning()">
          <i class="fas fa-exclamation-triangle"></i> Warning Toast
        </button>
        <button class="btn btn-info" (click)="showInfo()">
          <i class="fas fa-info"></i> Info Toast
        </button>
        <button class="btn btn-dark" (click)="showDefault()">
          <i class="fas fa-bell"></i> Default Toast
        </button>
      </div>
      <p class="note">
        <i class="fas fa-lightbulb"></i>
        Click any button above to test the toaster functionality. 
        The toasts will appear in the top-right corner of the screen.
      </p>
    </div>
  `,
  styles: [`
    .toaster-test-container {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px;
    }

    .button-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 20px 0;
    }

    .btn {
      padding: 10px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .btn-warning {
      background: #ffc107;
      color: #212529;
    }

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-dark {
      background: #343a40;
      color: white;
    }

    .note {
      margin-top: 20px;
      padding: 10px;
      background: #e9ecef;
      border-radius: 4px;
      border-left: 4px solid #007bff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h3 {
      color: #343a40;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .button-group {
        flex-direction: column;
      }
      
      .btn {
        justify-content: center;
      }
    }
  `]
})
export class ToasterTestComponent {
  constructor(private toasterService: ToasterService) {}

  showSuccess(): void {
    this.toasterService.showToast(
      'Operation completed successfully! This is a success message.',
      ToastType.Success,
      4000
    );
  }

  showError(): void {
    this.toasterService.showToast(
      'Something went wrong! This is an error message.',
      ToastType.Error,
      5000
    );
  }

  showWarning(): void {
    this.toasterService.showToast(
      'Please be careful! This is a warning message.',
      ToastType.Warn,
      4000
    );
  }

  showInfo(): void {
    this.toasterService.showToast(
      'Here is some useful information for you.',
      ToastType.Info,
      3000
    );
  }

  showDefault(): void {
    this.toasterService.showToast(
      'This is a default notification message.',
      ToastType.None,
      3000
    );
  }
}