"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AboutusModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var aboutus_routing_module_1 = require("./aboutus-routing.module");
var aboutus_component_1 = require("../aboutus/aboutus.component");
var shared_module_1 = require("../../shared.module");
var AboutusModule = /** @class */ (function () {
    function AboutusModule() {
    }
    AboutusModule = __decorate([
        core_1.NgModule({
            declarations: [
                aboutus_component_1.AboutusComponent
            ],
            imports: [
                common_1.CommonModule,
                aboutus_routing_module_1.AboutusRoutingModule,
                shared_module_1.SharedModule
            ]
        })
    ], AboutusModule);
    return AboutusModule;
}());
exports.AboutusModule = AboutusModule;
