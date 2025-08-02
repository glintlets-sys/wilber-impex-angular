"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FeedbackModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var feedback_routing_module_1 = require("./feedback-routing.module");
var feedback_component_1 = require("../feedback/feedback.component");
var shared_module_1 = require("../../shared.module");
var FeedbackModule = /** @class */ (function () {
    function FeedbackModule() {
    }
    FeedbackModule = __decorate([
        core_1.NgModule({
            declarations: [
                feedback_component_1.FeedbackComponent
            ],
            imports: [
                common_1.CommonModule,
                feedback_routing_module_1.FeedbackRoutingModule,
                shared_module_1.SharedModule
            ]
        })
    ], FeedbackModule);
    return FeedbackModule;
}());
exports.FeedbackModule = FeedbackModule;
