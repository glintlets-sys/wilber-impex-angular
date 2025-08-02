"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var admin_routing_module_1 = require("./admin-routing.module");
var admin_component_1 = require("../admin/admin.component");
var shared_module_1 = require("../../shared.module");
var admin_orders_module_1 = require("../admin-orders/admin-orders.module");
var stocks_module_1 = require("../stocks/stocks.module");
var toy_list_module_1 = require("../toy-list/toy-list.module");
var aws_image_list_module_1 = require("../aws-image-list/aws-image-list.module");
var stock_consignment_module_1 = require("../stock-consignment/stock-consignment.module");
var user_table_module_1 = require("../user-table/user-table.module");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        core_1.NgModule({
            declarations: [
                admin_component_1.AdminComponent
            ],
            imports: [
                common_1.CommonModule,
                admin_routing_module_1.AdminRoutingModule,
                shared_module_1.SharedModule,
                admin_orders_module_1.AdminOrdersModule,
                stocks_module_1.StocksModule,
                toy_list_module_1.ToyListModule,
                aws_image_list_module_1.AwsImageListModule,
                stock_consignment_module_1.StockConsignmentModule,
                user_table_module_1.UserTableModule
            ]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
