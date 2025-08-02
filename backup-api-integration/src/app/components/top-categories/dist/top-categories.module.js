"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TopCategoriesModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var top_categories_routing_module_1 = require("./top-categories-routing.module");
var top_categories_component_1 = require("./top-categories.component");
var catalog_item_module_1 = require("../catalog-item/catalog-item.module");
var TopCategoriesModule = /** @class */ (function () {
    function TopCategoriesModule() {
    }
    TopCategoriesModule = __decorate([
        core_1.NgModule({
            declarations: [
                top_categories_component_1.TopCategoriesComponent
            ],
            imports: [
                common_1.CommonModule,
                top_categories_routing_module_1.TopCategoriesRoutingModule,
                catalog_item_module_1.CatalogItemModule
            ],
            exports: [
                top_categories_component_1.TopCategoriesComponent
            ]
        })
    ], TopCategoriesModule);
    return TopCategoriesModule;
}());
exports.TopCategoriesModule = TopCategoriesModule;
