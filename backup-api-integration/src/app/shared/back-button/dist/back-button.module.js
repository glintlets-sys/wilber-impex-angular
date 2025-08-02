"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BackButtonModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../../shared.module");
var back_button_component_1 = require("./back-button.component");
var BackButtonModule = /** @class */ (function () {
    function BackButtonModule() {
    }
    BackButtonModule = __decorate([
        core_1.NgModule({
            declarations: [
                back_button_component_1.BackButtonComponent
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule
            ],
            exports: [
                back_button_component_1.BackButtonComponent
            ]
        })
    ], BackButtonModule);
    return BackButtonModule;
}());
exports.BackButtonModule = BackButtonModule;
