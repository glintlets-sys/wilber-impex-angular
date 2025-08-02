"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FeedbackComponent = void 0;
var core_1 = require("@angular/core");
var FeedbackComponent = /** @class */ (function () {
    function FeedbackComponent(feedbackService, toaster, router) {
        this.feedbackService = feedbackService;
        this.toaster = toaster;
        this.router = router;
        this.focus = false;
        this.focus1 = false;
        this.focus2 = false;
        this.focus3 = false;
    }
    FeedbackComponent.prototype.submitForm = function () {
        var _this = this;
        var feedback = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            message: this.message
        };
        this.feedbackService.submitFeedback(feedback)
            .subscribe(function (response) {
            _this.toaster.showToast("Thanks for your feedback!");
            console.log('Feedback submitted successfully!', response);
            // Reset form fields after successful submission
            _this.firstName = '';
            _this.lastName = '';
            _this.email = '';
            _this.message = '';
            _this.navigateToHome();
        }, function (error) {
            console.error('Error submitting feedback:', error);
            // Handle error scenario
        });
    };
    FeedbackComponent.prototype.navigateToHome = function () {
        this.router.navigate(['/home']);
    };
    FeedbackComponent = __decorate([
        core_1.Component({
            selector: 'app-feedback',
            templateUrl: './feedback.component.html',
            styleUrls: ['./feedback.component.scss']
        })
    ], FeedbackComponent);
    return FeedbackComponent;
}());
exports.FeedbackComponent = FeedbackComponent;
