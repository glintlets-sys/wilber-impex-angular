"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DeliveryAddressComponent = void 0;
var core_1 = require("@angular/core");
var DeliveryAddressComponent = /** @class */ (function () {
    function DeliveryAddressComponent(addressService, paymentService) {
        this.addressService = addressService;
        this.paymentService = paymentService;
        this.address = {};
        this.addresses = [];
        this.showManageSection = false;
        this.newAddress = {
            id: 0,
            firstLine: '',
            userId: 0,
            secondLine: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobileNumber: '',
            alternateNumber: '',
            emailAddress: '',
            isDefault: true
        };
        // Fetch the addresses on component initialization
        this.refreshAddresses();
        //this.addressService.getDefaultAddress().subscribe(val=>{
        //  this.selectedAddress = val;
        //});
    }
    DeliveryAddressComponent.prototype.saveNewAddress = function () {
        var _this = this;
        this.addressService.addAddress(this.newAddress).subscribe(function (val) {
            _this.refreshAddresses();
        });
        this.newAddress = {
            id: 0,
            userId: 0,
            firstLine: '',
            secondLine: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobileNumber: '',
            alternateNumber: '',
            emailAddress: '',
            isDefault: false
        };
        this.showNewAddressForm = false;
    };
    DeliveryAddressComponent.prototype.refreshAddresses = function () {
        var _this = this;
        this.addressService.getAllAddresses().subscribe(function (val) {
            _this.addresses = val;
            if (_this.addresses.length > 0) {
                _this.paymentService.setSelectedAddress(_this.addresses[0]);
                if (_this.selectedAddress === undefined) {
                    _this.selectedAddress = _this.addresses[0];
                }
            }
        });
    };
    DeliveryAddressComponent.prototype.cancelNewAddress = function () {
        this.newAddress = {
            id: 0,
            userId: 0,
            firstLine: '',
            secondLine: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobileNumber: '',
            alternateNumber: '',
            emailAddress: '',
            isDefault: false
        };
        this.showNewAddressForm = false;
    };
    DeliveryAddressComponent.prototype.addNewAddress = function () {
        this.showManageSection = true;
        this.selectedAddress = undefined;
        this.newAddress = {
            id: 0,
            userId: 0,
            firstLine: '',
            secondLine: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            mobileNumber: '',
            alternateNumber: '',
            emailAddress: '',
            isDefault: true
        };
    };
    DeliveryAddressComponent.prototype.deleteAddress = function (address) {
        var _this = this;
        // Delete the address from the address service
        this.addressService.deleteAddress(address).subscribe(function (val) {
            _this.refreshAddresses();
            if (address === _this.selectedAddress) {
                _this.selectedAddress = undefined;
                _this.paymentService.setSelectedAddress(undefined);
            }
        });
        // If the deleted address was selected, clear the selectedAddress
    };
    __decorate([
        core_1.Input()
    ], DeliveryAddressComponent.prototype, "address");
    DeliveryAddressComponent = __decorate([
        core_1.Component({
            selector: 'app-delivery-address',
            templateUrl: './delivery-address.component.html',
            styleUrls: ['./delivery-address.component.scss']
        })
    ], DeliveryAddressComponent);
    return DeliveryAddressComponent;
}());
exports.DeliveryAddressComponent = DeliveryAddressComponent;
