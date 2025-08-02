"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CarouselModalModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../../shared.module");
var carousel_modal_component_1 = require("./carousel-modal.component");
var carousel_1 = require("ngx-bootstrap/carousel");
var CarouselModalModule = /** @class */ (function () {
    function CarouselModalModule() {
    }
    CarouselModalModule = __decorate([
        core_1.NgModule({
            declarations: [
                carousel_modal_component_1.CarouselModalComponent
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                carousel_1.CarouselModule
            ],
            exports: [
                carousel_modal_component_1.CarouselModalComponent
            ]
        })
    ], CarouselModalModule);
    return CarouselModalModule;
}());
exports.CarouselModalModule = CarouselModalModule;
