"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CatalogItemComponent = void 0;
var core_1 = require("@angular/core");
var CatalogItemComponent = /** @class */ (function () {
    function CatalogItemComponent(router, cartService, catalog, recommendationService) {
        this.router = router;
        this.cartService = cartService;
        this.catalog = catalog;
        this.recommendationService = recommendationService;
        this.stockCount = 0;
        this.addedToCartFlag = false;
    }
    CatalogItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.catalog.getStockCount(this.item.id).subscribe(function (val) {
            _this.stockCount = val;
        });
        this.catalog.fetchStockCount(this.item.id);
        if (this.itemsFromSameCategory !== undefined) {
            this.recommendationService.addRecommendations(this.itemsFromSameCategory);
        }
    };
    CatalogItemComponent.prototype.openProduct = function () {
        this.router.navigate(['/product', this.item.id]);
    };
    CatalogItemComponent.prototype.isOutofStock = function () {
        return !(this.stockCount > 0);
    };
    CatalogItemComponent.prototype.isAddedToCart = function () {
        var _this = this;
        this.cartService.isItemInCartFromItemId(this.item.id).subscribe(function (val) {
            _this.addedToCartFlag = val;
        });
        return this.addedToCartFlag;
    };
    CatalogItemComponent.prototype.calculateDiscountedPrice = function (amount, percentVal) {
        return amount * ((100 - percentVal) / 100);
    };
    CatalogItemComponent.prototype.hasDiscount = function (discount) {
        if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
            return false;
        }
        return true;
    };
    __decorate([
        core_1.Input()
    ], CatalogItemComponent.prototype, "item");
    __decorate([
        core_1.Input()
    ], CatalogItemComponent.prototype, "itemsFromSameCategory");
    CatalogItemComponent = __decorate([
        core_1.Component({
            selector: 'app-catalog-item',
            templateUrl: './catalog-item.component.html',
            styleUrls: ['./catalog-item.component.scss']
        })
    ], CatalogItemComponent);
    return CatalogItemComponent;
}());
exports.CatalogItemComponent = CatalogItemComponent;
