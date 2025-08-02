"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var product_routing_module_1 = require("./product-routing.module");
var product_component_1 = require("../product/product.component");
var shared_module_1 = require("../../shared.module");
var carousel_1 = require("ngx-bootstrap/carousel");
var similar_products_module_1 = require("src/app/shared/similar-products/similar-products.module");
var carousel_modal_module_1 = require("src/app/shared/carousel-modal/carousel-modal.module");
var ProductModule = /** @class */ (function () {
    function ProductModule() {
    }
    ProductModule = __decorate([
        core_1.NgModule({
            declarations: [
                product_component_1.ProductComponent,
            ],
            imports: [
                common_1.CommonModule,
                product_routing_module_1.ProductRoutingModule,
                shared_module_1.SharedModule,
                carousel_1.CarouselModule,
                similar_products_module_1.SimilarProductsModule,
                carousel_modal_module_1.CarouselModalModule
            ]
        })
    ], ProductModule);
    return ProductModule;
}());
exports.ProductModule = ProductModule;
