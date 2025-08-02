"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StockConsignmentComponent = void 0;
var core_1 = require("@angular/core");
var StockConsignmentComponent = /** @class */ (function () {
    function StockConsignmentComponent(stockConsignmentService) {
        this.stockConsignmentService = stockConsignmentService;
        this.stockConsignments = [];
        this.editedStockConsignment = this.getNewStockConsignment();
        this.editMode = false;
    }
    StockConsignmentComponent.prototype.ngOnInit = function () {
        this.fetchStockConsignments();
    };
    StockConsignmentComponent.prototype.fetchStockConsignments = function () {
        var _this = this;
        this.stockConsignmentService.getAllStockConsignments().subscribe(function (consignments) {
            _this.stockConsignments = consignments;
            console.log(JSON.stringify(_this.stockConsignments));
        });
    };
    StockConsignmentComponent.prototype.editStockConsignment = function (stockConsignment) {
        this.editMode = true;
        this.editedStockConsignment = __assign({}, stockConsignment);
    };
    StockConsignmentComponent.prototype.addConsignmentItem = function () {
        // Create a new consignment item and add it to the edited stock consignment
        var newItem = {
            id: null,
            itemId: null,
            purchasePrice: {
                id: null,
                amount: null,
                currency: null
            },
            margin: null,
            shippingCost: {
                id: null,
                amount: null,
                currency: null
            },
            quantity: null
            // Add other fields here
        };
        this.editedStockConsignment.consignmentItem.push(newItem);
    };
    StockConsignmentComponent.prototype.saveStockConsignment = function () {
        var _this = this;
        // Save the edited stockConsignment using the stockConsignmentService
        this.stockConsignmentService.updateStockConsignment(this.editedStockConsignment).subscribe(function () {
            _this.editMode = false;
            _this.fetchStockConsignments();
        });
    };
    StockConsignmentComponent.prototype.cancelEdit = function () {
        this.editMode = false;
        this.editedStockConsignment = this.getNewStockConsignment();
    };
    StockConsignmentComponent.prototype.deleteStockConsignment = function (stockConsignmentId) {
        var _this = this;
        if (confirm('Are you sure you want to delete this stock consignment?')) {
            this.stockConsignmentService.deleteStockConsignment(stockConsignmentId).subscribe(function () {
                _this.fetchStockConsignments();
            });
        }
    };
    StockConsignmentComponent.prototype.createNewStockConsignment = function () {
        this.editedStockConsignment = this.getNewStockConsignment();
        this.editMode = true;
    };
    StockConsignmentComponent.prototype.getNewStockConsignment = function () {
        var newStockConsignment = {
            id: null,
            dealer: {
                id: null,
                dealerName: '',
                address: null
            },
            purchaseDate: null,
            consignmentCost: {
                id: null,
                amount: null,
                currency: null
            },
            consignmentItem: [],
            invoiceImage: null,
            shippingCost: {
                id: null,
                amount: null,
                currency: null
            },
            stockCreated: false,
            stockCreatedOn: null
        };
        return newStockConsignment;
    };
    StockConsignmentComponent = __decorate([
        core_1.Component({
            selector: 'app-stock-consignment',
            templateUrl: './stock-consignment.component.html',
            styleUrls: ['./stock-consignment.component.scss']
        })
    ], StockConsignmentComponent);
    return StockConsignmentComponent;
}());
exports.StockConsignmentComponent = StockConsignmentComponent;
