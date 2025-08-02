"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AgeCategoryComponent = void 0;
var core_1 = require("@angular/core");
var AgeCategoryComponent = /** @class */ (function () {
    function AgeCategoryComponent(router, recommendations) {
        this.router = router;
        this.recommendations = recommendations;
    }
    AgeCategoryComponent.prototype.navigateToCatalog = function (age) {
        this.router.navigate(['/catalog'], { queryParams: { age: age } });
    };
    AgeCategoryComponent.prototype.ngOnInit = function () {
        this.recommendations.updateRecommendations([]);
    };
    AgeCategoryComponent = __decorate([
        core_1.Component({
            selector: 'app-age-category',
            templateUrl: './age-category.component.html',
            styleUrls: ['./age-category.component.scss']
        })
    ], AgeCategoryComponent);
    return AgeCategoryComponent;
}());
exports.AgeCategoryComponent = AgeCategoryComponent;
