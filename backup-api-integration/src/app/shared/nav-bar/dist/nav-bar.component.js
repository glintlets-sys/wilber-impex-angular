"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavBarComponent = void 0;
var core_1 = require("@angular/core");
var toaster_1 = require("src/app/services/toaster");
var NavBarComponent = /** @class */ (function () {
    function NavBarComponent(authenticationService, router, toaster) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.router = router;
        this.toaster = toaster;
        this.isCollapsed = true;
        this.isLoggedInFlag = "false";
        router.events.subscribe(function (val) {
            _this.isCollapsed = true;
        });
        this.authenticationService.isUserLoggedIn.subscribe(function (data) {
            _this.isLoggedInFlag = data;
        });
    }
    NavBarComponent.prototype.ngOnInit = function () {
    };
    NavBarComponent.prototype.getLoginTitle = function () {
        return this.isLoggedin() ? "Account Settings" : "Login";
    };
    NavBarComponent.prototype.mobileView = function () {
        if (window.innerWidth < 992) {
            return true;
        }
        return false;
    };
    NavBarComponent.prototype.isAdminLinkVisible = function () {
        return this.isLoggedin() && this.authenticationService.isUserAdmin();
    };
    NavBarComponent.prototype.isLoggedin = function () {
        return (this.isLoggedInFlag == "true");
    };
    NavBarComponent.prototype.logout = function () {
        this.authenticationService.logoutUser();
        this.toaster.showToast("You have been logged out!", toaster_1.ToastType.Info, 3000);
        this.router.navigate([this.router.url]);
    };
    NavBarComponent = __decorate([
        core_1.Component({
            selector: 'app-nav-bar',
            templateUrl: './nav-bar.component.html',
            styleUrls: ['./nav-bar.component.scss']
        })
    ], NavBarComponent);
    return NavBarComponent;
}());
exports.NavBarComponent = NavBarComponent;
