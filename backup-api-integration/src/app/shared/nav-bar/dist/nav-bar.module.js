"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavbarModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_module_1 = require("../../shared.module");
var nav_bar_component_1 = require("./nav-bar.component");
var animations_1 = require("@angular/platform-browser/animations");
var collapse_1 = require("ngx-bootstrap/collapse");
var NavbarModule = /** @class */ (function () {
    function NavbarModule() {
    }
    NavbarModule = __decorate([
        core_1.NgModule({
            declarations: [
                nav_bar_component_1.NavBarComponent
            ],
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                animations_1.BrowserAnimationsModule,
                collapse_1.CollapseModule
            ],
            exports: [
                nav_bar_component_1.NavBarComponent
            ]
        })
    ], NavbarModule);
    return NavbarModule;
}());
exports.NavbarModule = NavbarModule;
