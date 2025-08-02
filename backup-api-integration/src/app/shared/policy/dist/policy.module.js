"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PolicyModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var policy_routing_module_1 = require("./policy-routing.module");
var policy_component_1 = require("../policy/policy.component");
var shared_module_1 = require("../../shared.module");
var PolicyModule = /** @class */ (function () {
    function PolicyModule() {
    }
    PolicyModule = __decorate([
        core_1.NgModule({
            declarations: [
                policy_component_1.PolicyComponent
            ],
            imports: [
                common_1.CommonModule,
                policy_routing_module_1.PolicyRoutingModule,
                shared_module_1.SharedModule
            ]
        })
    ], PolicyModule);
    return PolicyModule;
}());
exports.PolicyModule = PolicyModule;
