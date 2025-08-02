import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../services/interfaces';
import { CartService } from '../services/cart.service';
import { SMSService } from '../services/sms.service';
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
  countdown$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private smsService: SMSService,
    private router: Router
  ) {
    this.countdown$ = this.smsService.countdown$;
  }

  ngOnInit(): void {
    // If user is already logged in, redirect to home
    this.authService.isUserLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn === 'true') {
        this.router.navigate(['/']);
      }
    });
  }

  // Mobile number validation
  isValidMobile(): boolean {
    return this.mobile.length === 10 && /^\d+$/.test(this.mobile);
  }

  // Send OTP
  async sendOTP(): Promise<void> {
    if (!this.isValidMobile()) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number';
      return;
    }

    console.log('🔍 [LOGIN] Starting user existence check for mobile:', this.mobile);
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Check if user is registered
      console.log('📞 [LOGIN] Calling isRegisteredUser API for mobile:', this.mobile);
      const isRegistered = await this.authService.isRegisteredUser(this.mobile).toPromise();
      console.log('✅ [LOGIN] User existence check result:', isRegistered);
      
      if (!isRegistered) {
        console.log('👤 [LOGIN] User EXISTS - sending OTP directly for login');
        // Existing user - send OTP directly for login
        const success = await this.smsService.sendSMS(this.mobile);
        this.loading = false;
        
        if (success) {
          console.log('📱 [LOGIN] OTP sent successfully for existing user');
          this.successMessage = 'OTP sent successfully!';
          this.step = 'otp';
          this.otp = '';
          // Start countdown for resend
          this.smsService.startCountdown(60);
        } else {
          console.log('❌ [LOGIN] Failed to send OTP for existing user');
          this.errorMessage = 'Failed to send OTP. Please try again.';
        }
      } else {
        console.log('🆕 [LOGIN] User NOT EXISTS - redirecting to registration form');
        // New user - go to registration form
        this.loading = false;
        this.step = 'register';
        this.successMessage = 'Please provide your details to complete registration';
      }
    } catch (error) {
      console.error('❌ [LOGIN] Error during user existence check:', error);
      this.loading = false;
      this.errorMessage = 'Failed to verify mobile number. Please try again.';
      console.error('Send OTP error:', error);
    }
  }

  // Simple OTP input handling
  onOtpInput(event: any): void {
    const input = event.target;
    let value = input.value;

    // Only allow digits
    value = value.replace(/\D/g, '');
    
    // Limit to 4 digits
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    
    // Update input and otp
    input.value = value;
    this.otp = value;
  }



  // Verify OTP
  verifyOTP(): void {
    if (this.otp.length !== 4) {
      this.errorMessage = 'Please enter the complete 4-digit OTP';
      return;
    }

    console.log('🔐 [VERIFY] Starting OTP verification for mobile:', this.mobile);
    console.log('🔐 [VERIFY] Entered OTP:', this.otp);

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // First check if OTP matches the one sent by SMS service
    let sentOTP: string | null = null;
    this.smsService.latestOTP$.subscribe(otp => {
      sentOTP = otp;
    });
    console.log('🔐 [VERIFY] Sent OTP from SMS service:', sentOTP);
    console.log('🔐 [VERIFY] OTP match:', this.otp === sentOTP);

    console.log('✅ [VERIFY] Proceeding with authentication using OTP as password');
    // Proceed with authentication using OTP as password
    this.authService.authenticateUser(this.mobile, this.otp);
    
    // Listen to the success subject for authentication result
    this.authService.success$.subscribe({
      next: (result) => {
        console.log('✅ [VERIFY] Authentication result:', result);
        this.loading = false;
        if (result === 'true') {
          console.log('👤 [VERIFY] Authentication successful, proceeding with login');
          // Authentication successful - login directly
          this.handleExistingUserLogin();
        } else {
          console.log('❌ [VERIFY] Authentication failed');
          this.errorMessage = 'Invalid OTP. Please check and try again.';
        }
      },
      error: (error) => {
        console.error('❌ [VERIFY] Error during authentication:', error);
        this.loading = false;
        this.errorMessage = 'Authentication failed. Please try again.';
        console.error('Authentication error:', error);
      }
    });
  }

  private handleExistingUserLogin(): void {
    // For existing users, we can either auto-login or require additional verification
    // For now, we'll create a basic user object and login
    const user: User = {
      id: 'user_' + Date.now(),
      mobile: this.mobile,
      firstName: '',
      lastName: '',
      isNewUser: false,
      createdAt: new Date()
    };
    
    this.handleSuccessfulLogin(user);
  }

  // Register new user with "0000" password and send OTP
  async register(): Promise<void> {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.errorMessage = 'Please enter your first name and last name';
      return;
    }

    console.log('📝 [REGISTER] Starting registration for mobile:', this.mobile);
    console.log('📝 [REGISTER] User details:', {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim() || 'not provided'
    });

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Register user with "0000" password using backup service
      console.log('🔐 [REGISTER] Calling registerUser API with "0000" password');
      const response = await this.authService.registerUser(
        this.firstName.trim(),
        this.mobile,
        "0000"
      ).toPromise();
      console.log('✅ [REGISTER] Registration API response:', response);
      
      if (response && response.authStatus === 'SUCCESS') {
        console.log('✅ [REGISTER] Registration successful, sending OTP');
        // Registration successful, now send OTP for login
        const success = await this.smsService.sendSMS(this.mobile);
        this.loading = false;
        
        if (success) {
          console.log('📱 [REGISTER] OTP sent successfully after registration');
          this.successMessage = 'Registration successful! OTP sent to your mobile.';
          this.step = 'otp';
          this.otp = '';
          // Start countdown for resend
          this.smsService.startCountdown(60);
        } else {
          console.log('❌ [REGISTER] Failed to send OTP after registration');
          this.errorMessage = 'Registration successful but failed to send OTP. Please try again.';
        }
      } else {
        console.log('❌ [REGISTER] Registration failed:', response?.message);
        this.loading = false;
        this.errorMessage = response?.message || 'Registration failed. Please try again.';
      }
    } catch (error) {
      console.error('❌ [REGISTER] Registration error:', error);
      this.loading = false;
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration error:', error);
    }
  }

  private handleSuccessfulLogin(user: User): void {
    // Login the user using backup service
    this.authService.authenticateUser(user.mobile, "0000");
    
    // Note: Backup doesn't have mergeCart method, so we'll skip that for now
    // const cartItems = this.cartService.getCartItems();
    // if (cartItems.length > 0) {
    //   // Cart merge functionality not available in backup
    // }

    this.successMessage = 'Login successful!';
    
    // Redirect to previous page or home
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }

  // Resend OTP
  resendOTP(): void {
    this.smsService.stopCountdown();
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