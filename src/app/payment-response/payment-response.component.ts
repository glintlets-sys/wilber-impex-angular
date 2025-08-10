import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { ToasterService } from '../shared-services/toaster.service';
import { ToastType } from '../shared-services/toaster';
import { PhonePePaymentService } from '../shared-services/phone-pe-payment.service';

@Component({
  selector: 'app-payment-response',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-body text-center p-5">
              <div *ngIf="isLoading" class="mb-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Processing payment...</span>
                </div>
                <h5 class="mt-3">Processing your payment...</h5>
              </div>

              <div *ngIf="!isLoading">
                <!-- Success State -->
                <div *ngIf="paymentStatus === 'success'" class="text-success">
                  <i class="fas fa-check-circle fa-4x mb-3"></i>
                  <h3 class="mb-3">Payment Successful!</h3>
                  <p class="text-muted mb-4">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
                  <div class="order-details mb-4" *ngIf="orderId">
                    <h6>Order ID: {{ orderId }}</h6>
                  </div>
                  <button class="btn btn-primary me-2" (click)="viewOrders()">
                    <i class="fas fa-list me-2"></i>View Orders
                  </button>
                  <button class="btn btn-outline-primary" (click)="continueShopping()">
                    <i class="fas fa-shopping-cart me-2"></i>Continue Shopping
                  </button>
                </div>

                <!-- Failure State -->
                <div *ngIf="paymentStatus === 'failure'" class="text-danger">
                  <i class="fas fa-times-circle fa-4x mb-3"></i>
                  <h3 class="mb-3">Payment Failed</h3>
                  <p class="text-muted mb-4">{{ errorMessage || 'Your payment could not be processed. Please try again.' }}</p>
                  <button class="btn btn-primary me-2" (click)="retryPayment()">
                    <i class="fas fa-redo me-2"></i>Retry Payment
                  </button>
                  <button class="btn btn-outline-secondary" (click)="goToCheckout()">
                    <i class="fas fa-arrow-left me-2"></i>Back to Checkout
                  </button>
                </div>

                <!-- Pending State -->
                <div *ngIf="paymentStatus === 'pending'" class="text-warning">
                  <i class="fas fa-clock fa-4x mb-3"></i>
                  <h3 class="mb-3">Payment Pending</h3>
                  <p class="text-muted mb-4">Your payment is being processed. Please wait while we confirm your transaction.</p>
                  <button class="btn btn-primary" (click)="checkPaymentStatus()">
                    <i class="fas fa-sync me-2"></i>Check Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 15px;
    }
    
    .fa-check-circle {
      color: #28a745;
    }
    
    .fa-times-circle {
      color: #dc3545;
    }
    
    .fa-clock {
      color: #ffc107;
    }
    
    .btn {
      border-radius: 25px;
      padding: 10px 25px;
    }
  `]
})
export class PaymentResponseComponent implements OnInit {
  isLoading = true;
  paymentStatus: 'success' | 'failure' | 'pending' = 'pending';
  orderId: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToasterService,
    private phonePeService: PhonePePaymentService
  ) {}

  ngOnInit(): void {
    // Simulate loading time
    setTimeout(() => {
      this.processPaymentResponse();
    }, 2000);
  }

  private processPaymentResponse(): void {
    // Get URL parameters from PhonePe redirect
    this.route.queryParams.subscribe(params => {
      console.log('🔍 [PaymentResponseComponent] URL Parameters:', params);
      
      // Check if this is a mock payment
      const isMockPayment = params['mock'] === 'true';
      
      // Just continue with normal processing for mock payments too
      
      // Extract payment response data
      const code = params['code'];
      const merchantTransactionId = params['merchantTransactionId'];
      const transactionId = params['transactionId'];
      const amount = params['amount'];
      const redirectMode = params['redirectMode'];
      const redirectUrl = params['redirectUrl'];
      const merchantId = params['merchantId'];
      const merchantUserId = params['merchantUserId'];
      const status = params['status'];
      const responseCode = params['responseCode'];
      const checksum = params['checksum'];
      const errorCode = params['errorCode'];
      const errorMessage = params['errorMessage'];

      // Get order ID from localStorage
      this.orderId = localStorage.getItem('completedOrderId');

      console.log('📦 [PaymentResponseComponent] Order ID from localStorage:', this.orderId);
      console.log('💳 [PaymentResponseComponent] Payment Status:', status);
      console.log('🔢 [PaymentResponseComponent] Response Code:', responseCode);

      // Determine payment status based on PhonePe response
      if (status === 'PAYMENT_SUCCESS' || responseCode === 'SUCCESS') {
        this.paymentStatus = 'success';
        const message = isMockPayment 
          ? '🎭 Mock Payment: Payment completed successfully! (Development Mode)' 
          : 'Payment completed successfully!';
        this.toasterService.showToast(message, ToastType.Success, 5000);
        this.clearOrderFromStorage();
      } else if (status === 'PAYMENT_ERROR' || status === 'PAYMENT_DECLINED' || responseCode === 'PAYMENT_ERROR') {
        this.paymentStatus = 'failure';
        this.errorMessage = errorMessage || 'Payment was declined or failed';
        this.toasterService.showToast('Payment failed. Please try again.', ToastType.Error, 5000);
      } else if (status === 'PAYMENT_PENDING' || responseCode === 'PENDING') {
        this.paymentStatus = 'pending';
        this.toasterService.showToast('Payment is pending. Please wait.', ToastType.Warn, 5000);
      } else {
        // Default to failure for unknown status
        this.paymentStatus = 'failure';
        this.errorMessage = 'Unknown payment status';
        this.toasterService.showToast('Payment status unclear. Please contact support.', ToastType.Error, 5000);
      }

      this.isLoading = false;
    });
  }

  private clearOrderFromStorage(): void {
    localStorage.removeItem('completedOrderId');
  }



  viewOrders(): void {
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  retryPayment(): void {
    // Redirect back to checkout to retry payment
    this.router.navigate(['/checkout']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  checkPaymentStatus(): void {
    // Use PhonePe service to check payment status
    const merchantTransactionId = this.route.snapshot.queryParams['merchantTransactionId'];
    if (merchantTransactionId) {
      this.isLoading = true;
      this.phonePeService.verifyPaymentStatus(merchantTransactionId).subscribe({
        next: (response: any) => {
          this.processStatusResponse(response);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
          this.toasterService.showToast('Unable to check payment status', ToastType.Error, 3000);
          this.isLoading = false;
        }
      });
    } else {
      // Reload the page if no merchantTransactionId is available
      window.location.reload();
    }
  }

  private processStatusResponse(response: any): void {
    if (response && response.success) {
      if (response.data && response.data.state === 'COMPLETED') {
        this.paymentStatus = 'success';
        this.toasterService.showToast('Payment verified successfully!', ToastType.Success, 3000);
      } else if (response.data && response.data.state === 'FAILED') {
        this.paymentStatus = 'failure';
        this.errorMessage = response.data.responseCodeDescription || 'Payment failed';
        this.toasterService.showToast('Payment verification failed', ToastType.Error, 3000);
      } else {
        this.paymentStatus = 'pending';
        this.toasterService.showToast('Payment is still being processed', ToastType.Warn, 3000);
      }
    } else {
      this.paymentStatus = 'failure';
      this.errorMessage = 'Unable to verify payment status';
      this.toasterService.showToast('Payment verification failed', ToastType.Error, 3000);
    }
  }
} 