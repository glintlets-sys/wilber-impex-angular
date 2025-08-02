"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginpageComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var toaster_1 = require("src/app/services/toaster");
var LoginpageComponent = /** @class */ (function () {
    function LoginpageComponent(authenticationService, router, route, toaster, loadingService, smsService) {
        this.authenticationService = authenticationService;
        this.router = router;
        this.route = route;
        this.toaster = toaster;
        this.loadingService = loadingService;
        this.smsService = smsService;
        this.isRegistering = false; // Flag to indicate if user is in registration mode
        this.passwordConfirmation = ''; // Password confirmation input field value
        this.otpRequested = false; // Flag to indicate if OTP is requested
        this.otpVerificationDisabled = true; // Flag to disable OTP verification button
        this.otpVerified = false; // Flag to indicate if OTP is verified
        this.otpCountdown = 0; // Countdown timer for OTP button
        this.authDetails = {
            mobileNumber: "",
            authPin: "",
            username: ""
        };
        this.registrationDetails = {
            mobileNumber: "",
            authPin: "",
            username: "",
            otp: ""
        };
        this.errorMessage = ''; // Error message to display
        // Page loading flag
        this.pageLoading = false;
        /**************************************************************** */
        this.otpInput = ''; // Separate variable to store OTP input value
        // ############## forgot pin ##################
        this.forgotPassword = false;
        this.forgotPasswordDetails = {
            mobileNumber: ''
        };
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    LoginpageComponent.prototype.ngOnInit = function () {
        var body = document.getElementsByTagName("body")[0];
        body.classList.add("login-page");
    };
    LoginpageComponent.prototype.ngOnDestroy = function () {
        var body = document.getElementsByTagName("body")[0];
        body.classList.remove("login-page");
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
        }
    };
    // When someone clicks on the login button
    LoginpageComponent.prototype.userLogin = function () {
        var _this = this;
        // Check if there are valid credentials in the input fields, if not, do nothing
        if (!this.isValidCredentials()) {
            return;
        }
        // Set pageLoading to true and make an API call
        this.pageLoading = true;
        console.log("User login is attempted");
        this.loadingService.showLoadingOverlay();
        // Authenticate user with the provided credentials
        this.authenticationService.authenticateUser(this.authDetails.mobileNumber, this.authDetails.authPin);
        this.authenticationService.success$
            .subscribe(function (authenticated) {
            if (authenticated === "true") {
                _this.navigateToBackPage();
                _this.loadingService.hideLoadingOverlay();
                _this.toaster.showToast("You have logged in succesfully. ", toaster_1.ToastType.Success, 2000);
            }
            else if (authenticated === "") {
                // do nothing. 
            }
            else {
                // Authentication failed, show error message or handle accordingly
                console.log("Authentication failed");
                _this.loadingService.hideLoadingOverlay();
                _this.toaster.showToast("Authetication failed. Please retry or reach out to glintlets@gmail.com", toaster_1.ToastType.Error, 5000);
            }
            _this.pageLoading = false;
        }, function (error) {
            console.log("Error occurred while authenticating user:", error);
            _this.pageLoading = false;
            _this.loadingService.hideLoadingOverlay();
        });
    };
    LoginpageComponent.prototype.verifyOTP = function () {
        if (!this.registrationDetails.otp) {
            console.log("Please enter the OTP received.");
            this.toaster.showToast("Please enter the OTP received.", toaster_1.ToastType.Error, 10000);
            return false;
        }
        if (isNaN(Number(this.registrationDetails.otp)) || (this.registrationDetails.otp + "").length !== 6) {
            console.log("Please enter a valid OTP.");
            this.toaster.showToast("Please enter a valid OTP!", toaster_1.ToastType.Error, 10000);
            return false;
        }
        if (!(this.registrationDetails.otp + "" === this.responseOTP)) {
            this.toaster.showToast("OTP entered is wrong. Please verify!", toaster_1.ToastType.Error, 10000);
            return false;
        }
        this.otpVerified = true;
        this.otpVerificationDisabled = true;
        console.log("OTP Verification Successful");
        return true;
    };
    // When someone clicks on the register button
    LoginpageComponent.prototype.userRegister = function () {
        var _this = this;
        // Check if there are valid credentials in the input fields and if password confirmation matches
        if (!this.isValidCredentialsForRegistration() || !this.isValidPasswordConfirmationForRegistration() || !this.isValidUserNameForRegistration()) {
            this.toaster.showToast("Invalid Credential. Please Correct and Retry!", toaster_1.ToastType.Warn, 5000);
            return;
        }
        //TODO: 
        if (!this.verifyOTP()) {
            return;
        }
        // Set pageLoading to true and make an API call
        this.pageLoading = true;
        console.log("User registration is attempted");
        this.loadingService.showLoadingOverlay();
        this.authenticationService.resetSuccessSubject();
        // Register the user with the provided credentials
        this.authenticationService.registerUser(this.registrationDetails.username, this.registrationDetails.mobileNumber, this.registrationDetails.authPin);
        this.authenticationService.success$
            .subscribe(function (registered) {
            if (registered === "true") {
                console.log("User registered successfully!");
                // Optionally, you can automatically log in the user after registration
                // this.userLogin();
                _this.toaster.showToast("Thanks for registering with Glint Toy Shop!.", toaster_1.ToastType.Success, 10000);
                _this.loadingService.hideLoadingOverlay();
                _this.navigateToMyAccountPage();
            }
            else if (registered == "") {
                // do nothing. 
            }
            else {
                // Registration failed, show error message or handle accordingly
                console.log("Registration failed");
                _this.toaster.showToast(registered.error, toaster_1.ToastType.Error, 5000);
                _this.pageLoading = false;
                _this.loadingService.hideLoadingOverlay();
            }
        });
    };
    // Validate if the input fields have valid credentials
    LoginpageComponent.prototype.isValidCredentials = function () {
        return !!this.authDetails.mobileNumber && !!this.authDetails.authPin;
    };
    LoginpageComponent.prototype.isValidCredentialsForRegistration = function () {
        return !!this.registrationDetails.mobileNumber && !!this.registrationDetails.authPin;
    };
    LoginpageComponent.prototype.isValidUserNameForRegistration = function () {
        return !!this.registrationDetails.username;
    };
    LoginpageComponent.prototype.isValidPasswordConfirmationForRegistration = function () {
        return this.registrationDetails.authPin === this.passwordConfirmation;
    };
    // Switch to registration mode
    LoginpageComponent.prototype.switchToRegister = function () {
        this.isRegistering = true;
        this.errorMessage = '';
    };
    // Switch back to login mode
    LoginpageComponent.prototype.switchToLogin = function () {
        this.isRegistering = false;
        this.errorMessage = '';
        this.passwordConfirmation = '';
        this.isRegistering = false;
        this.registrationDetails.otp = '';
        this.otpRequested = false;
        this.otpVerificationDisabled = true;
        this.otpVerified = false;
    };
    LoginpageComponent.prototype.navigateToBackPage = function () {
        // Redirect back to the original route
        //this.navigateToMyAccountPage();
        this.router.navigateByUrl(this.returnUrl);
        // TODO: Depending on the origin of the login page, go to the back page.
    };
    LoginpageComponent.prototype.navigateToMyAccountPage = function () {
        if (this.returnUrl != undefined) {
            this.navigateToBackPage();
        }
        else {
            this.router.navigate(['/myaccount']);
        }
    };
    LoginpageComponent.prototype.requestOTP = function () {
        var _this = this;
        if (this.otpRequested && this.otpCountdown !== 0) {
            return;
        }
        if (!this.isValidCredentialsForRegistration()) {
            this.toaster.showToast('Invalid Credential. Please Correct and Retry!', toaster_1.ToastType.Error, 5000);
            return;
        }
        if (!this.isValidPasswordConfirmationForRegistration()) {
            this.toaster.showToast('Passwords do not match. Please Correct and Retry!', toaster_1.ToastType.Error, 5000);
            return;
        }
        this.smsService.sendSMS(this.registrationDetails.mobileNumber).then(function (success) {
            if (success) {
                _this.smsService.latestOTP$.subscribe(function (otp) {
                    if (otp) {
                        _this.responseOTP = otp;
                        _this.otpRequested = true;
                        _this.otpCountdown = 30;
                        _this.countdownSubscription = rxjs_1.timer(0, 1000)
                            .pipe(operators_1.take(31), operators_1.map(function (value) { return 30 - value; }))
                            .subscribe(function (countdown) {
                            _this.otpCountdown = countdown;
                            if (countdown === 0) {
                                _this.countdownSubscription.unsubscribe();
                            }
                        });
                    }
                });
            }
            else {
                // this.toaster.showToast('Failed to send SMS', ToastType.Error, 5000);
            }
        });
    };
    // Existing methods
    LoginpageComponent.prototype.showForgotPassword = function () {
        this.forgotPassword = true;
    };
    LoginpageComponent.prototype.cancelForgotPassword = function () {
        this.forgotPassword = false;
    };
    LoginpageComponent.prototype.sendNewPin = function () {
        var _this = this;
        this.smsService.sendCustomerPin(this.forgotPasswordDetails.mobileNumber).then(function (success) {
            if (success) {
                _this.forgotPassword = false;
                //this.authDetails.mobileNumber = this.forgotPasswordDetails.mobileNumber;
            }
        });
    };
    LoginpageComponent = __decorate([
        core_1.Component({
            selector: "app-loginpage",
            templateUrl: "loginpage.component.html"
        })
    ], LoginpageComponent);
    return LoginpageComponent;
}());
exports.LoginpageComponent = LoginpageComponent;
