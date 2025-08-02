"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountComponent = void 0;
var core_1 = require("@angular/core");
var axios_1 = require("axios");
var toaster_1 = require("src/app/services/toaster");
var AccountComponent = /** @class */ (function () {
    function AccountComponent(userService, toaster, loadingService) {
        this.userService = userService;
        this.toaster = toaster;
        this.loadingService = loadingService;
    }
    AccountComponent.prototype.ngOnInit = function () {
        if (localStorage.getItem("userDetails") !== "") {
            this.username = JSON.parse(localStorage.getItem("userDetails")).username; // Set the username
            this.getUserData();
        }
    };
    AccountComponent.prototype.getUserData = function () {
        var _this = this;
        this.userService.getUserByUsername(this.username)
            .subscribe(function (user) {
            _this.user = user;
            if (!_this.user.email) {
                _this.toaster.showToast("Please fill in email Address for communications. ", toaster_1.ToastType.Info, 10000);
            }
        }, function (error) {
            console.log('Error occurred while fetching user data:', error);
        });
    };
    AccountComponent.prototype.saveUser = function () {
        var _this = this;
        this.loadingService.showLoadingOverlay();
        this.userService.updateUserByUsername(this.username, this.user)
            .subscribe(function (updatedUser) {
            _this.user = updatedUser;
            console.log('User updated successfully!');
            _this.loadingService.hideLoadingOverlay();
            _this.toaster.showToast("User information has been updated", toaster_1.ToastType.Success, 5000);
        }, function (error) {
            console.log('Error occurred while updating user:', error);
            _this.loadingService.hideLoadingOverlay();
            _this.toaster.showToast("Sorry! :( something went wrong. Please try after sometime or contact glintlets@gmail.com for further concern or assistance.");
        });
    };
    AccountComponent.prototype.validatePincode = function () {
        var _this = this;
        var pincode = this.user.pincode;
        axios_1["default"].get("https://api.postalpincode.in/pincode/" + pincode)
            .then(function (response) {
            var pincodeData = response.data[0];
            if (pincodeData && pincodeData.Status === 'Success') {
                _this.user.state = pincodeData.PostOffice[0].State;
                _this.user.city = pincodeData.PostOffice[0].Name;
            }
            else {
                console.log('Invalid pincode');
            }
        })["catch"](function (error) {
            console.error('Error fetching pincode data:', error);
        });
    };
    AccountComponent = __decorate([
        core_1.Component({
            selector: 'app-account',
            templateUrl: './account.component.html',
            styleUrls: ['./account.component.scss']
        })
    ], AccountComponent);
    return AccountComponent;
}());
exports.AccountComponent = AccountComponent;
