"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminOrdersModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../../shared.module");
var admin_orders_component_1 = require("./admin-orders.component");
var dispatch_details_module_1 = require("../dispatch-details/dispatch-details.module");
var AdminOrdersModule = /** @class */ (function () {
    function AdminOrdersModule() {
    }
    AdminOrdersModule = __decorate([
        core_1.NgModule({
            declarations: [
                admin_orders_component_1.AdminOrdersComponent
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                dispatch_details_module_1.DispatchDetailsModule
            ],
            exports: [
                admin_orders_component_1.AdminOrdersComponent
            ]
        })
    ], AdminOrdersModule);
    return AdminOrdersModule;
}());
exports.AdminOrdersModule = AdminOrdersModule;
