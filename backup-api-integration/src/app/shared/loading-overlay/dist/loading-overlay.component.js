"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoadingOverlayComponent = void 0;
var core_1 = require("@angular/core");
var LoadingOverlayComponent = /** @class */ (function () {
    function LoadingOverlayComponent(loadingOverlayService) {
        this.loadingOverlayService = loadingOverlayService;
        this.isLoading = false;
        this.message = '';
    }
    LoadingOverlayComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingOverlayService.loadingState$.subscribe(function (loadingState) {
            _this.isLoading = loadingState.isLoading;
            _this.message = loadingState.message;
        });
    };
    LoadingOverlayComponent = __decorate([
        core_1.Component({
            selector: 'app-loading-overlay',
            template: "\n    <div *ngIf=\"isLoading\" class=\"loading-overlay\">\n  <div class=\"loading-spinner\">\n    <img src=\"https://glinttoyshoppics.s3.ap-south-1.amazonaws.com/25189682-9d61-4ac3-a1b3-a2901d84b188-20230718220716095.png\" alt=\"Logo\" class=\"logo-rotate\">\n  </div>\n</div>\n  ",
            styles: ["\n    .loading-overlay {\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background-color: rgba(255, 255, 255, 0.8);\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 9999;\n    }\n    .loading-spinner {\n      animation: rotate 1.5s linear infinite;\n    }\n\n    @keyframes rotate {\n        0% {\n          transform: rotate(0deg);\n        }\n        100% {\n          transform: rotate(360deg);\n        }\n    }\n\n    .logo-rotate {\n      width: 100px; /* Adjust the width as needed */\n      height: auto;\n    }\n    .loading-message {\n      background-color: #fff;\n      padding: 20px;\n      border-radius: 4px;\n    }\n  "]
        })
    ], LoadingOverlayComponent);
    return LoadingOverlayComponent;
}());
exports.LoadingOverlayComponent = LoadingOverlayComponent;
