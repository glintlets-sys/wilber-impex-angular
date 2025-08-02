import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription, timer } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { ToasterService } from "src/app/services/toaster.service";
import { ToastType } from "src/app/services/toaster";
import { LoadingOverlayService } from "src/app/services/loading-overlay.service";
import { SMSService } from "src/app/services/sms.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/services/user";

@Component({
  selector: "app-loginpage",
  templateUrl: "loginpage.component.html",
  styleUrls: ['loginpage.component.scss']
})
export class LoginpageComponent implements OnInit, OnDestroy {
  focus;
  focus1;
  focus2;
  focus3;
  focus4;
  returnUrl: string;
  isRegistering: boolean = false; // Flag to indicate if user is in registration mode
  passwordConfirmation: string = ''; // Password confirmation input field value
  otpRequested: boolean = false; // Flag to indicate if OTP is requested
  otpVerificationDisabled: boolean = true; // Flag to disable OTP verification button
  otpVerified: boolean = false; // Flag to indicate if OTP is verified
  otpCountdown: number = 0; // Countdown timer for OTP button
  private countdownSubscription: Subscription; // Subscription for countdown timer
  userAlreadyRegistered: boolean;

  authDetails: any = {
    mobileNumber: "",
    authPin: "",
    username: "",
  };

  registrationDetails: any = {
    mobileNumber: "",
    authPin: "",
    username: "",
    otp: ""
  };

  errorMessage: string = ''; // Error message to display
  // Page loading flag
  pageLoading: boolean = false;
  otpInput: string = ''; // Separate variable to store OTP input value
  forgotPassword: boolean = false;
  private responseOTP: any;
  userName: string;
  user: User;
  isLoggedInFlag = "false"
  
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private loadingService: LoadingOverlayService,
    private smsService: SMSService,
    private userService: UserService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.countdownSubscription = this.smsService.countdown$.subscribe(() => { });
  }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    this.authenticationService.isUserLoggedIn.subscribe((data) => {
      this.isLoggedInFlag = data;
      if (this.isLoggedInFlag) {
        this.router.navigateByUrl('/');
      }
      this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe((event: NavigationStart) => {
        if (event.url === '/login' && this.isLoggedInFlag) {
          this.router.navigateByUrl('/');
        }
      });
    })



  }

  public checkUserExistence() {

    // if Mobile number is still set. 
    if (!this.isValidMobileNumber()) {
      this.toaster.showToast("Please enter valid Mobile number", ToastType.Error, 3000);
      return;
    }
    // Set pageLoading to true and make an API call
    this.pageLoading = true;
    this.loadingService.showLoadingOverlay();
    // Assuming you have an Observable returned from your authenticationService
    this.smsService.startCountdown(30);
    this.authenticationService.isRegisteredUser(this.authDetails.mobileNumber)
      .subscribe(
        (response: boolean) => {
          // Handle the response from the backend
          if (!response) {
            this.userAlreadyRegistered = true; // if the user is already registered. 
            // trigger forgot password
            this.smsService.sendCustomerPin(this.authDetails.mobileNumber).then((success) => {
              if (success) {
                this.otpRequested = true;
              } else {
                this.userAlreadyRegistered = false;
                this.toaster.showToast("Sorry! Something wrong. Unable to sent OTP. Please retry.", ToastType.Error, 3000);
              }
              this.loadingService.hideLoadingOverlay();
            });
          } else {
            this.userAlreadyRegistered = false;
            this.authenticationService.registerUser(this.authDetails.username, this.authDetails.mobileNumber, "0000")
              .subscribe(
                (data: any) => {
                  if (data && data.authStatus === 'SUCCESS') {

                    //Request OTP and 
                    this.smsService.sendCustomerPin(this.authDetails.mobileNumber).then((success) => {
                      if (success) {
                        this.otpRequested = true;

                      } else {
                        this.userAlreadyRegistered = false;
                        this.toaster.showToast("Sorry! Something wrong. Unable to sent OTP. Please retry.", ToastType.Error, 3000);
                      }
                    });
                    this.loadingService.hideLoadingOverlay();
                  }
                },
                (error: any) => {
                  this.toaster.showToast(error, ToastType.Error, 3000);
                  this.pageLoading = false;
                  this.loadingService.hideLoadingOverlay();
                }
              );
          }
        },
        (error) => {
          console.error("Error checking user existence:", error);
          this.pageLoading = false;
          this.loadingService.hideLoadingOverlay();
          // Handle the error as needed
        }
      );
  }

  // When someone clicks on the login button
  public userLogin() {
    // Check if there are valid credentials in the input fields, if not, do nothing
    if (!this.isValidCredentials()) {
      return;
    }

    if (!this.userAlreadyRegistered) {
      if (!this.userName) {
        this.toaster.showToast("Please Enter User Name", ToastType.Warn, 3000)
        return
      }
    }
    // Set pageLoading to true and make an API call
    this.pageLoading = true;
    this.loadingService.showLoadingOverlay();
    // Authenticate user with the provided credentials
    this.authenticationService.authenticateUser(this.authDetails.mobileNumber, this.authDetails.authPin);
    this.authenticationService.success$
      .subscribe(
        (authenticated: string) => {
          if (authenticated === "true") {

            //not tested yes because i dont have any new number right now.
            if (!this.userAlreadyRegistered) {

              this.userService.getUserByUsername(this.authDetails.mobileNumber).subscribe(val=>{
                this.user = val;
                this.user.name = this.userName;
                this.userService.updateUserByUsername(this.authDetails.mobileNumber, this.user)
                .subscribe(
                  (updatedUser: User) => {
                    this.user = updatedUser;
                    this.loadingService.hideLoadingOverlay();
                    this.toaster.showToast("User information has been updated", ToastType.Success, 3000);
                  },
                  (error) => {
                    this.loadingService.hideLoadingOverlay();
                    this.toaster.showToast("Sorry! :( something went wrong. Please try after sometime or contact glintlets@gmail.com for further concern or assistance.", ToastType.Error, 3000)
                  }
                );
              })

      
            }
            this.loadingService.hideLoadingOverlay();
            this.toaster.showToast("You have logged in succesfully. ", ToastType.Success, 3000);
            this.navigateToBackPage();
          } else if (authenticated === "") {
            // do nothing. 
          } else {
            // Authentication failed, show error message or handle accordingly
            this.loadingService.hideLoadingOverlay();
            this.toaster.showToast("Authetication failed. Please retry or reach out to glintlets@gmail.com", ToastType.Error, 3000);
          }
          this.pageLoading = false;
        },
        (error) => {
          this.pageLoading = false;
          this.loadingService.hideLoadingOverlay();
        }
      );
  }

  public verifyOTP(): boolean {
    if (!this.registrationDetails.otp) {
      this.toaster.showToast("Please enter the OTP received.", ToastType.Error, 3000);
      return false;
    }

    if (isNaN(Number(this.registrationDetails.otp)) || (this.registrationDetails.otp + "").length !== 6) {
      this.toaster.showToast("Please enter a valid OTP!", ToastType.Error, 3000);
      return false;
    }

    if (!(this.registrationDetails.otp + "" === this.responseOTP)) {
      this.toaster.showToast("OTP entered is wrong. Please verify!", ToastType.Error, 3000);
      return false;
    }
    this.otpVerified = true;
    this.otpVerificationDisabled = true;
    return true;
  }

  // Validate if the input fields have valid credentials
  private isValidMobileNumber(): boolean {
    const mobileNumber = this.authDetails.mobileNumber;
    // Check if mobileNumber is not null and is a string
    if (typeof mobileNumber !== 'string' || mobileNumber === null) {
      return false;
    }

    // Regular expression to check if the string is exactly 10 digits
    const regex = /^\d{10}$/;

    // Test the mobileNumber against the regex
    return regex.test(mobileNumber);
  }

  private isValidCredentials(): boolean {
    return !!this.authDetails.mobileNumber && !!this.authDetails.authPin;
  }

  public switchToLogin() {
    this.isRegistering = false;
    this.errorMessage = '';
    this.passwordConfirmation = '';
    this.isRegistering = false;
    this.registrationDetails.otp = '';
    this.otpRequested = false;
    this.otpVerificationDisabled = true;
    this.otpVerified = false;
    this.unsubscribeCountdown();
  }

  private navigateToBackPage() {
    if (this.returnUrl != '') {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.router.navigate(['/']);
      this.userService.storeUserName()
    }
  }

  public requestOTP(): void {
    this.startCountdown();
    this.checkUserExistence();
  }

  private startCountdown() {
    if (this.otpRequested) {
      this.unsubscribeCountdown();
      this.countdownSubscription = this.smsService.countdown$.subscribe(() => { });
    }
  }

  ngAfterViewInit() {
    // Clear input values to prevent autofill
    document.querySelectorAll('input').forEach((input: any) => {
      input.value = '';
    });
  }

  private unsubscribeCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
      this.smsService.stopCountdown(); // Stop the countdown when unsubscribing
    }
  }

  ngOnDestroy() {
    this.unsubscribeCountdown();
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
  }

  // private isValidCredentialsForRegistration(): boolean {
  //   return !!this.registrationDetails.mobileNumber;
  // }

  // private isValidUserNameForRegistration(): boolean {
  //   return !!this.registrationDetails.username;
  // }

  // private isValidPasswordConfirmationForRegistration(): boolean {
  //   return this.registrationDetails.authPin === this.passwordConfirmation;
  // }

  // private navigateToMyAccountPage() {
  //   if (this.returnUrl != undefined) {
  //     this.navigateToBackPage();
  //   } else {
  //     this.router.navigate(['/myaccount']);
  //   }
  // }
}
