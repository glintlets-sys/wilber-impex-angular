"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LandingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var landing_routing_module_1 = require("./landing-routing.module");
var landing_component_1 = require("./../landing/landing.component");
var age_category_module_1 = require("../age-category/age-category.module");
var catalog_items_module_1 = require("../catalog-items/catalog-items.module");
var router_1 = require("@angular/router");
var categories_summary_module_1 = require("../categories-summary/categories-summary.module");
var feedback_module_1 = require("../feedback/feedback.module");
var collapse_1 = require("ngx-bootstrap/collapse");
var ngx_owl_carousel_o_1 = require("ngx-owl-carousel-o");
var promoted_categories_module_1 = require("../promoted-categories/promoted-categories.module");
var top_categories_module_1 = require("../top-categories/top-categories.module");
var LandingModule = /** @class */ (function () {
    function LandingModule() {
    }
    LandingModule = __decorate([
        core_1.NgModule({
            declarations: [
                landing_component_1.LandingComponent,
            ],
            imports: [
                landing_routing_module_1.LandingRoutingModule,
                router_1.RouterModule,
                catalog_items_module_1.CatalogItemsModule,
                age_category_module_1.AgeCategoryModule,
                categories_summary_module_1.CategoriesSummaryModule,
                feedback_module_1.FeedbackModule,
                collapse_1.CollapseModule,
                ngx_owl_carousel_o_1.CarouselModule,
                promoted_categories_module_1.PromotedCategoriesModule,
                top_categories_module_1.TopCategoriesModule,
                common_1.CommonModule
            ]
        })
    ], LandingModule);
    return LandingModule;
}());
exports.LandingModule = LandingModule;
