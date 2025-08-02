"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CustomerInfoComponent = void 0;
var core_1 = require("@angular/core");
var CustomerInfoComponent = /** @class */ (function () {
    function CustomerInfoComponent() {
        this.currentStep = 1;
        this.kidName = '';
        this.selectedGender = '';
        this.dateOfBirth = '';
        this.selectedCategory = '';
    }
    CustomerInfoComponent.prototype.nextStep = function () {
        if (this.currentStep < 4) {
            this.currentStep++;
        }
    };
    CustomerInfoComponent.prototype.selectGender = function (gender) {
        this.selectedGender = gender;
    };
    CustomerInfoComponent.prototype.submitForm = function () {
        // You can perform any actions with the gathered customer information here
        console.log('Customer Information:');
        console.log('Kid Name:', this.kidName);
        console.log('Gender:', this.selectedGender);
        console.log('Date of Birth:', this.dateOfBirth);
        console.log('Selected Category:', this.selectedCategory);
        // Reset the form
        this.currentStep = 1;
        this.kidName = '';
        this.selectedGender = '';
        this.dateOfBirth = '';
        this.selectedCategory = '';
    };
    CustomerInfoComponent = __decorate([
        core_1.Component({
            selector: 'app-customer-info',
            templateUrl: './customer-info.component.html',
            styleUrls: ['./customer-info.component.scss']
        })
    ], CustomerInfoComponent);
    return CustomerInfoComponent;
}());
exports.CustomerInfoComponent = CustomerInfoComponent;
