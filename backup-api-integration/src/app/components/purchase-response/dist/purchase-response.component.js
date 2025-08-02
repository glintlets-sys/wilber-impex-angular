"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseResponseComponent = void 0;
var core_1 = require("@angular/core");
var PurchaseResponseComponent = /** @class */ (function () {
    function PurchaseResponseComponent(route, router) {
        this.route = route;
        this.router = router;
    }
    PurchaseResponseComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Get the success/failure status from the route query parameter
        this.route.queryParams.subscribe(function (params) {
            _this.isSuccess = params.success === 'true';
        });
        this.route.queryParams.subscribe(function (params) {
            _this.encryptedResponse = params.encryptedResponse;
        });
    };
    PurchaseResponseComponent.prototype.navigateToHomePage = function () {
        this.router.navigate(['/']);
    };
    PurchaseResponseComponent = __decorate([
        core_1.Component({
            selector: 'app-purchase-response',
            templateUrl: 'purchase-response.component.html',
            styleUrls: ['purchase-response.component.scss']
        })
    ], PurchaseResponseComponent);
    return PurchaseResponseComponent;
}());
exports.PurchaseResponseComponent = PurchaseResponseComponent;
