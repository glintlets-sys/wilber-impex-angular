import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, VerifyOTPRequest, RegisterRequest, User } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  step: 'mobile' | 'otp' | 'register' = 'mobile';
  mobile: string = '';
  otp: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  


  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  // Mobile number validation
  isValidMobile(): boolean {
    return this.mobile.length === 10 && /^\d+$/.test(this.mobile);
  }

  // Send OTP
  sendOTP(): void {
    if (!this.isValidMobile()) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: LoginRequest = { mobile: this.mobile };
    
    this.authService.sendOTP(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
                     this.successMessage = 'OTP sent successfully!';
           this.step = 'otp';
           this.otp = '';
        } else {
          this.errorMessage = response.message || 'Failed to send OTP';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to send OTP. Please try again.';
        console.error('Send OTP error:', error);
      }
    });
  }

  // Simple OTP input handling
  onOtpInput(event: any): void {
    const input = event.target;
    let value = input.value;

    // Only allow digits
    value = value.replace(/\D/g, '');
    
    // Limit to 6 digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    
    // Update input and otp
    input.value = value;
    this.otp = value;
  }



  // Verify OTP
  verifyOTP(): void {
    if (this.otp.length !== 6) {
      this.errorMessage = 'Please enter the complete 6-digit OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: VerifyOTPRequest = { mobile: this.mobile, otp: this.otp };
    
    this.authService.verifyOTP(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.user) {
          if (response.user.isNewUser) {
            // New user - go to registration step
            this.step = 'register';
          } else {
            // Existing user - login directly
            this.handleSuccessfulLogin(response.user);
          }
        } else {
          this.errorMessage = response.message || 'Invalid OTP';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to verify OTP. Please try again.';
        console.error('Verify OTP error:', error);
      }
    });
  }

  // Register new user
  register(): void {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.errorMessage = 'Please enter your first name and last name';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: RegisterRequest = {
      mobile: this.mobile,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim() || undefined
    };
    
    this.authService.register(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.user) {
          this.handleSuccessfulLogin(response.user);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  private handleSuccessfulLogin(user: User): void {
    // Login the user
    this.authService.login(user);
    
    // Merge cart with backend if there are items
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length > 0) {
      this.authService.mergeCart(cartItems).subscribe({
        next: (response) => {
          console.log('Cart merged:', response.message);
        },
        error: (error) => {
          console.error('Cart merge error:', error);
        }
      });
    }

    this.successMessage = 'Login successful!';
    
    // Redirect to previous page or home
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }

  // Resend OTP
  resendOTP(): void {
    this.sendOTP();
  }

  // Go back to mobile step
  goBackToMobile(): void {
         this.step = 'mobile';
     this.errorMessage = '';
     this.successMessage = '';
     this.otp = '';
  }

  // Go back to OTP step
  goBackToOtp(): void {
    this.step = 'otp';
    this.errorMessage = '';
    this.successMessage = '';
  }
} 