"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MainModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var main_routing_module_1 = require("./main-routing.module");
var main_component_1 = require("../main/main.component");
var shared_module_1 = require("../../shared.module");
var MainModule = /** @class */ (function () {
    function MainModule() {
    }
    MainModule = __decorate([
        core_1.NgModule({
            declarations: [
                main_component_1.MainComponent
            ],
            imports: [
                common_1.CommonModule,
                main_routing_module_1.MainRoutingModule,
                shared_module_1.SharedModule
            ]
        })
    ], MainModule);
    return MainModule;
}());
exports.MainModule = MainModule;
