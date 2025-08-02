"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DispatchDetailsComponent = void 0;
var core_1 = require("@angular/core");
var dispatchSummary_1 = require("../../services/dispatchSummary");
var DispatchDetailsComponent = /** @class */ (function () {
    function DispatchDetailsComponent(dispatchService) {
        this.dispatchService = dispatchService;
        this.shipmentStatusOptions = Object.values(dispatchSummary_1.SHIPMENTSTATUS);
        this.editMode = false;
    }
    DispatchDetailsComponent.prototype.ngOnInit = function () {
        this.getDispatchSummary();
    };
    DispatchDetailsComponent.prototype.getDispatchSummary = function () {
        var _this = this;
        this.dispatchService.getDispatchSummaryById(this.dispatchId)
            .subscribe(function (summary) {
            _this.dispatchSummary = summary;
        });
    };
    DispatchDetailsComponent.prototype.toggleEditMode = function () {
        this.editMode = !this.editMode;
    };
    DispatchDetailsComponent.prototype.saveDispatchSummary = function () {
        var _this = this;
        this.dispatchService.updateDispatchSummary(this.dispatchSummary)
            .subscribe(function () {
            _this.editMode = false;
        });
    };
    __decorate([
        core_1.Input()
    ], DispatchDetailsComponent.prototype, "dispatchId");
    DispatchDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-dispatch-details',
            templateUrl: './dispatch-details.component.html',
            styleUrls: ['./dispatch-details.component.scss']
        })
    ], DispatchDetailsComponent);
    return DispatchDetailsComponent;
}());
exports.DispatchDetailsComponent = DispatchDetailsComponent;
