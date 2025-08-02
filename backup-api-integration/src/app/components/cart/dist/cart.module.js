"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var cart_routing_module_1 = require("./cart-routing.module");
var cart_component_1 = require("../cart/cart.component");
var shared_module_1 = require("../../shared.module");
var delivery_address_module_1 = require("../delivery-address/delivery-address.module");
var CartModule = /** @class */ (function () {
    function CartModule() {
    }
    CartModule = __decorate([
        core_1.NgModule({
            declarations: [
                cart_component_1.CartComponent
            ],
            imports: [
                common_1.CommonModule,
                cart_routing_module_1.CartRoutingModule,
                shared_module_1.SharedModule,
                delivery_address_module_1.DeliveryAddressModule
            ]
        })
    ], CartModule);
    return CartModule;
}());
exports.CartModule = CartModule;
