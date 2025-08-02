"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BackButtonComponent = void 0;
var core_1 = require("@angular/core");
var BackButtonComponent = /** @class */ (function () {
    function BackButtonComponent(location) {
        this.location = location;
        this.showButton = false;
    }
    /*
    @HostListener('window:popstate', [])
    onPopState() {
      this.showButton = this.location.path() !== '';
    }*/
    BackButtonComponent.prototype.onWindowScroll = function () {
        this.showButton = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 300;
    };
    BackButtonComponent.prototype.goBack = function () {
        this.location.back();
    };
    __decorate([
        core_1.HostListener('window:scroll', [])
    ], BackButtonComponent.prototype, "onWindowScroll");
    BackButtonComponent = __decorate([
        core_1.Component({
            selector: 'app-back-button',
            template: "\n    <a href=\"javascript:;\" class=\"btn btn-primary btn-round btn-icon btn-back\" (click)=\"goBack()\" [ngClass]=\"{ 'd-none': !showButton }\">\n      <span class=\"btn-inner--icon\"><i class=\"ni ni-bold-left\"></i></span>\n    </a>\n  ",
            styleUrls: ['./back-button.component.scss']
        })
    ], BackButtonComponent);
    return BackButtonComponent;
}());
exports.BackButtonComponent = BackButtonComponent;
