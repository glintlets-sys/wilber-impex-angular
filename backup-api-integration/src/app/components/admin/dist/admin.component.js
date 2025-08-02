"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminComponent = void 0;
var core_1 = require("@angular/core");
var AdminComponent = /** @class */ (function () {
    function AdminComponent() {
        this.toggleToysView = false;
        this.togglePicturesView = false;
        this.toggleStockConsignmentsView = false;
        this.toggleStocksView = false;
        this.toggleUserTableView = false;
        this.toggleOrdersTableView = false;
    }
    AdminComponent.prototype.reset = function () {
        this.togglePicturesView = false;
        this.toggleStockConsignmentsView = false;
        this.toggleStocksView = false;
        this.toggleToysView = false;
        this.toggleUserTableView = false;
    };
    AdminComponent.prototype.toggleToys = function () {
        this.reset();
        this.toggleToysView = !this.toggleToysView;
    };
    AdminComponent.prototype.togglePictures = function () {
        this.reset();
        this.togglePicturesView = !this.togglePicturesView;
    };
    AdminComponent.prototype.toggleStockConsignments = function () {
        this.reset();
        this.toggleStockConsignmentsView = !this.toggleStockConsignmentsView;
    };
    AdminComponent.prototype.toggleStocks = function () {
        this.reset();
        this.toggleStocksView = !this.toggleStocksView;
    };
    AdminComponent.prototype.toggleUserTable = function () {
        this.reset();
        this.toggleUserTableView = !this.toggleUserTableView;
    };
    AdminComponent.prototype.toggleOrdersView = function () {
        this.reset();
        this.toggleOrdersTableView = !this.toggleOrdersTableView;
    };
    AdminComponent = __decorate([
        core_1.Component({
            selector: 'app-admin',
            templateUrl: './admin.component.html',
            styleUrls: ['./admin.component.scss']
        })
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;
