"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StocksComponent = void 0;
var core_1 = require("@angular/core");
var stock_1 = require("src/app/services/stock");
var StocksComponent = /** @class */ (function () {
    function StocksComponent(stockService) {
        this.stockService = stockService;
        this.stocks = [];
        this.itemQuantity = {};
        this.itemStock = {};
    }
    StocksComponent.prototype.ngOnInit = function () {
        this.loadStocks();
        this.itemStock = this.getItemStock();
    };
    StocksComponent.prototype.getTotalStockCount = function () {
        return this.stocks.length;
    };
    /*itemStock = {
      "itemId":0,
      "detail": {
        "quantity":0,
        "Locked": 0,
        "Active": 0,
        "Ready":0,
        "AddedToCart":0,
        "Sold":0
      }
    }*/
    StocksComponent.prototype.getItemStock = function () {
        var itemStock = {};
        this.stocks.forEach(function (stock) {
            var itemId = stock.itemId, stockStatus = stock.stockStatus, lockedStock = stock.lockedStock;
            if (!itemStock.hasOwnProperty(itemId)) {
                itemStock[itemId] = {
                    quantity: 0,
                    locked: 0,
                    active: 0,
                    ready: 0,
                    addedToCart: 0,
                    sold: 0
                };
            }
            itemStock[itemId].quantity++;
            if (lockedStock) {
                itemStock[itemId].locked++;
            }
            switch (stockStatus) {
                case stock_1.StockStatus.ACTIVE:
                    itemStock[itemId].active++;
                    break;
                case stock_1.StockStatus.READY:
                    itemStock[itemId].ready++;
                    break;
                case stock_1.StockStatus.ADDEDTOCART:
                    itemStock[itemId].addedToCart++;
                    break;
                case stock_1.StockStatus.SOLD:
                    itemStock[itemId].sold++;
                    break;
                default:
                    break;
            }
        });
        return itemStock;
    };
    StocksComponent.prototype.loadStocks = function () {
        var _this = this;
        this.stockService.getAllStocks().subscribe(function (data) {
            _this.stocks = data;
        }, function (error) {
            console.log('Error loading stocks:', error);
        });
    };
    StocksComponent.prototype.getStockStatusName = function (status) {
        switch (status) {
            case stock_1.StockStatus.READY:
                return 'Ready';
            case stock_1.StockStatus.ACTIVE:
                return 'Active';
            case stock_1.StockStatus.ADDEDTOCART:
                return 'Added to Cart';
            case stock_1.StockStatus.SOLD:
                return 'Sold';
            default:
                return '';
        }
    };
    StocksComponent.prototype.editStock = function (stock) {
        // Handle editing logic
    };
    StocksComponent.prototype.deleteStock = function (stockId) {
        // Handle deletion logic
    };
    StocksComponent = __decorate([
        core_1.Component({
            selector: 'app-stocks',
            templateUrl: './stocks.component.html',
            styleUrls: ['./stocks.component.scss']
        })
    ], StocksComponent);
    return StocksComponent;
}());
exports.StocksComponent = StocksComponent;
