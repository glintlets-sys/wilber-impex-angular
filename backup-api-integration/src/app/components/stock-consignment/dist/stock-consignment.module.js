"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StockConsignmentModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../../shared.module");
var stock_consignment_component_1 = require("./stock-consignment.component");
var StockConsignmentModule = /** @class */ (function () {
    function StockConsignmentModule() {
    }
    StockConsignmentModule = __decorate([
        core_1.NgModule({
            declarations: [
                stock_consignment_component_1.StockConsignmentComponent
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule
            ],
            exports: [
                stock_consignment_component_1.StockConsignmentComponent
            ]
        })
    ], StockConsignmentModule);
    return StockConsignmentModule;
}());
exports.StockConsignmentModule = StockConsignmentModule;
