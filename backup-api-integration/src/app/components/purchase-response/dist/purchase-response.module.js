"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PurchaseResponseModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var purchase_response_routing_module_1 = require("./purchase-response-routing.module");
var purchase_response_component_1 = require("../purchase-response/purchase-response.component");
var shared_module_1 = require("../../shared.module");
var PurchaseResponseModule = /** @class */ (function () {
    function PurchaseResponseModule() {
    }
    PurchaseResponseModule = __decorate([
        core_1.NgModule({
            declarations: [
                purchase_response_component_1.PurchaseResponseComponent
            ],
            imports: [
                common_1.CommonModule,
                purchase_response_routing_module_1.PurchaseResponseRoutingModule,
                shared_module_1.SharedModule
            ]
        })
    ], PurchaseResponseModule);
    return PurchaseResponseModule;
}());
exports.PurchaseResponseModule = PurchaseResponseModule;
