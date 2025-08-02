"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.SimilarProductsComponent = void 0;
var core_1 = require("@angular/core");
var SimilarProductsComponent = /** @class */ (function () {
    function SimilarProductsComponent(catalogService, toasterService, loadingOverlay, route, recommendationService) {
        this.catalogService = catalogService;
        this.toasterService = toasterService;
        this.loadingOverlay = loadingOverlay;
        this.route = route;
        this.recommendationService = recommendationService;
        this.loadingComplete = false;
    }
    SimilarProductsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isLoading = true;
        this.recommendationService.recommendations$.subscribe(function (toys) {
            _this.allItems = toys.filter(function (item, index, self) { return self.findIndex(function (t) { return t.id === item.id; }) === index; });
            _this.loadItems(0, 12);
            _this.isLoading = false;
        });
        window.addEventListener('scroll', this.onScroll.bind(this));
    };
    SimilarProductsComponent.prototype.isPresentItem = function (itemFromLoop) {
        if (itemFromLoop.id === this.item.id) {
            return false;
        }
        return true;
    };
    SimilarProductsComponent.prototype.getCatalogItems = function () {
        console.log(JSON.stringify(this.items));
        return this.items;
        //return [];
    };
    SimilarProductsComponent.prototype.loadItems = function (startIndex, count) {
        // Load the items from the data source based on the start index and count
        // Replace this with your actual data loading logic
        var _this = this;
        if (this.visibleItems != undefined) {
            var newItems = this.allItems.slice(startIndex, startIndex + count);
            var index = newItems.findIndex(function (item) { return item.id === _this.item.id; });
            if (index !== -1) {
                newItems.splice(index, 1);
            }
            if (newItems.length === 0 && this.visibleItems.length !== 0) {
                this.loadingComplete = true;
            }
            this.visibleItems = __spreadArrays(this.visibleItems, newItems);
        }
        else {
            var index = this.allItems.findIndex(function (item) { return item.id === _this.item.id; });
            if (index !== -1) {
                this.allItems.splice(index, 1);
            }
            this.visibleItems = this.allItems.slice(startIndex, startIndex + count);
        }
    };
    SimilarProductsComponent.prototype.onScroll = function () {
        var _this = this;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight &&
            !this.isLoading && !this.loadingComplete) {
            this.isLoading = true;
            // Simulate an asynchronous data loading
            setTimeout(function () {
                // Load more items (4 or 5 items)
                var startIndex = _this.visibleItems.length;
                _this.loadItems(startIndex, 6);
                _this.isLoading = false;
            }, 4000);
        }
    };
    __decorate([
        core_1.Input()
    ], SimilarProductsComponent.prototype, "item");
    SimilarProductsComponent = __decorate([
        core_1.Component({
            selector: 'app-similar-products',
            templateUrl: './similar-products.component.html',
            styleUrls: ['./similar-products.component.scss']
        })
    ], SimilarProductsComponent);
    return SimilarProductsComponent;
}());
exports.SimilarProductsComponent = SimilarProductsComponent;
