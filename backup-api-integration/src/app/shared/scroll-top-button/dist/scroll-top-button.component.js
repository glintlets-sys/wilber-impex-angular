"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScrollTopButtonComponent = void 0;
var core_1 = require("@angular/core");
var ScrollTopButtonComponent = /** @class */ (function () {
    function ScrollTopButtonComponent() {
        this.showButton = false;
    }
    ScrollTopButtonComponent.prototype.onWindowScroll = function () {
        this.showButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300;
    };
    ScrollTopButtonComponent.prototype.scrollToTop = function () {
        (function smoothscroll() {
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    };
    __decorate([
        core_1.HostListener('window:scroll', [])
    ], ScrollTopButtonComponent.prototype, "onWindowScroll");
    ScrollTopButtonComponent = __decorate([
        core_1.Component({
            selector: 'app-scroll-top-button',
            template: "\n    <a href=\"javascript:;\" class=\"btn btn-danger btn-round btn-icon btn-scroll-top\" (click)=\"scrollToTop()\" [ngClass]=\"{ 'd-none': !showButton }\">\n      <span class=\"btn-inner--icon\"><i class=\"ni ni-bold-up\"></i></span>\n    </a>\n  ",
            styleUrls: ['./scroll-top-button.component.scss']
        })
    ], ScrollTopButtonComponent);
    return ScrollTopButtonComponent;
}());
exports.ScrollTopButtonComponent = ScrollTopButtonComponent;
