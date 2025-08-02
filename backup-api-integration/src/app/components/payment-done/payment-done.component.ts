import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-payment-done',
  templateUrl: './payment-done.component.html',
  styleUrls: ['./payment-done.component.scss']
})
export class PaymentDoneComponent implements OnInit, OnDestroy {

  countdown: number;
  interval: any; // Variable to store the interval reference
  isIntervalRunning: boolean = true; // Flag to track if the interval is running
  oderDetails: any = []
  getOrderId: any = ''
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<PaymentDoneComponent>,
    private orderService: OrderService
  ) {
    this.countdown = 5; // Countdown from 5 seconds
  }

  ngOnInit(): void {
    const orderId = localStorage.getItem("completedOrderId")
    this.getOrderId = orderId
    this.getOrderDetail(this.getOrderId)
    window.scrollTo(0, 0);

    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.interval);
        this.isIntervalRunning = false;
        this.dialogRef.close('orderSuccess');
      }
    }, 1000);
  }

  getOrderDetail(orderId) {
    this.orderService.getOrdersById(orderId).subscribe((val) => {
      this.oderDetails = val;
    })
  }

  redirectToHome() {
    if (this.isIntervalRunning) {
      clearInterval(this.interval); // Stop the interval before redirecting
      this.isIntervalRunning = false;
      this.dialogRef.close('orderSuccess');
    }

    // Redirect to the home page
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    localStorage.removeItem("completedOrederId")
  }

}
