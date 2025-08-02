"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ToyListComponent = void 0;
var core_1 = require("@angular/core");
var ToyListComponent = /** @class */ (function () {
    function ToyListComponent(toyService, waitService) {
        this.toyService = toyService;
        this.waitService = waitService;
        this.toys = [];
        this.newToy = { id: 0, name: '', code: '', price: null, brand: '', photoLinks: [], videoLinks: [], brandColor: '', skillSet: null, kidsAge: null, productDescription: [], discount: null };
        this.showAddToy = false;
        this.editMode = false;
        this.editedToy = { id: 0, name: '', code: '', price: null, brand: '', photoLinks: [], videoLinks: [], brandColor: '', skillSet: null, kidsAge: null, productDescription: [], discount: null };
    }
    ToyListComponent.prototype.ngOnInit = function () {
        this.waitService.showLoadingOverlay();
        this.getToys();
    };
    ToyListComponent.prototype.getToys = function () {
        var _this = this;
        this.toyService.getAllToys().subscribe(function (toys) {
            // Filter toys by code
            _this.toys = toys.filter(function (toy) { return toy.code !== null && toy.code !== undefined && toy.code !== ""; });
            console.log(JSON.stringify(_this.toys));
            _this.waitService.hideLoadingOverlay();
        });
    };
    ToyListComponent.prototype.createToy = function () {
        var _this = this;
        this.toyService.createToy(this.newToy).subscribe(function (toy) {
            _this.toys.push(toy);
            _this.resetForm();
        });
    };
    ToyListComponent.prototype.deleteToy = function (toyId) {
        var _this = this;
        this.toyService.deleteToy(toyId).subscribe(function () {
            _this.toys = _this.toys.filter(function (toy) { return toy.id !== toyId; });
        });
    };
    ToyListComponent.prototype.editToy = function (toy) {
        this.editMode = true;
        this.editedToy = __assign({}, toy);
    };
    ToyListComponent.prototype.saveToy = function () {
        var _this = this;
        this.toyService.updateToy(this.editedToy).subscribe(function (updatedToy) {
            var index = _this.toys.findIndex(function (toy) { return toy.id === updatedToy.id; });
            if (index > -1) {
                _this.toys[index] = updatedToy;
            }
            _this.cancelEdit();
        });
    };
    ToyListComponent.prototype.cancelEdit = function () {
        this.editMode = false;
        this.resetEditForm();
    };
    ToyListComponent.prototype.showAddToyForm = function () {
        this.showAddToy = true;
    };
    ToyListComponent.prototype.cancelAddToy = function () {
        this.resetForm();
    };
    ToyListComponent.prototype.resetForm = function () {
        this.newToy = { id: 0, name: '', code: '', price: null, brand: '', photoLinks: [], videoLinks: [], brandColor: '', skillSet: null, kidsAge: null, productDescription: [], discount: null };
        this.showAddToy = false;
    };
    ToyListComponent.prototype.resetEditForm = function () {
        this.editedToy = { id: 0, name: '', code: '', price: null, brand: '', photoLinks: [], videoLinks: [], brandColor: '', skillSet: null, kidsAge: null, productDescription: [], discount: null };
    };
    ToyListComponent.prototype.addDescription = function () {
        this.newToy.productDescription.push({ heading: '', text: '', pictureUrl: '' });
    };
    ToyListComponent.prototype.removeDescription = function (index) {
        this.newToy.productDescription.splice(index, 1);
    };
    // Inside your component class
    ToyListComponent.prototype.addProductDescription = function () {
        this.editedToy.productDescription.push({ heading: '', text: '', pictureUrl: '' });
    };
    ToyListComponent.prototype.removeProductDescription = function (index) {
        this.editedToy.productDescription.splice(index, 1);
    };
    ToyListComponent.prototype.addPhotoLink = function () {
        this.editedToy.photoLinks.push('');
    };
    ToyListComponent.prototype.removePhotoLink = function (index) {
        this.editedToy.photoLinks.splice(index, 1);
    };
    ToyListComponent.prototype.addVideoLink = function () {
        this.editedToy.videoLinks.push('');
    };
    ToyListComponent.prototype.removeVideoLink = function (index) {
        this.editedToy.videoLinks.splice(index, 1);
    };
    ToyListComponent.prototype.getFirstPictureUrl = function (toy) {
        if (toy.photoLinks && toy.photoLinks.length > 0) {
            return toy.photoLinks[0];
        }
        return '';
    };
    ToyListComponent = __decorate([
        core_1.Component({
            selector: 'app-toy-list',
            templateUrl: './toy-list.component.html',
            styleUrls: ['./toy-list.component.scss']
        })
    ], ToyListComponent);
    return ToyListComponent;
}());
exports.ToyListComponent = ToyListComponent;
