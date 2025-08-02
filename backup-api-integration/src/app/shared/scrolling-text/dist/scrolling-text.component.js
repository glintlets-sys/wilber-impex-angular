"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ScrollingTextComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var ScrollingTextComponent = /** @class */ (function () {
    function ScrollingTextComponent() {
        this.scrollAnimation = '';
    }
    ScrollingTextComponent.prototype.ngOnInit = function () {
        var _this = this;
        setInterval(function () {
            _this.startScrollAnimation();
        }, 5000);
    };
    ScrollingTextComponent.prototype.startScrollAnimation = function () {
        var _this = this;
        setTimeout(function () {
            _this.scrollAnimation = 'scrolling';
        }, 0);
    };
    ScrollingTextComponent.prototype.onAnimationEnd = function (event) {
        this.scrollAnimation = '';
    };
    ScrollingTextComponent = __decorate([
        core_1.Component({
            selector: 'app-scrolling-text',
            templateUrl: './scrolling-text.component.html',
            styleUrls: ['./scrolling-text.component.scss'],
            animations: [
                animations_1.trigger('scrollAnimation', [
                    animations_1.state('scrolling', animations_1.style({
                        transform: 'translateX(-100%)'
                    })),
                    animations_1.transition('* => scrolling', [
                        animations_1.style({ transform: 'translateX(100%)' }),
                        animations_1.animate('15s linear')
                    ]),
                ])
            ]
        })
    ], ScrollingTextComponent);
    return ScrollingTextComponent;
}());
exports.ScrollingTextComponent = ScrollingTextComponent;
