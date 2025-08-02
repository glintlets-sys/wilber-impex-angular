"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AwsImageListComponent = void 0;
// aws-image-list.component.ts
var core_1 = require("@angular/core");
var AwsImageListComponent = /** @class */ (function () {
    function AwsImageListComponent(awsImageService, toasterService, loadingService) {
        this.awsImageService = awsImageService;
        this.toasterService = toasterService;
        this.loadingService = loadingService;
        this.images = [];
        this.totalItems = 0;
        this.currentPage = 0;
        this.pageSize = 10;
    }
    AwsImageListComponent.prototype.ngOnInit = function () {
        this.loadImages();
    };
    AwsImageListComponent.prototype.loadImages = function () {
        var _this = this;
        this.awsImageService.getAllImages(this.currentPage, this.pageSize)
            .subscribe(function (imagePage) {
            console.log("response: " + JSON.stringify(imagePage));
            _this.images = imagePage.content;
            _this.totalItems = imagePage.totalElements;
            _this.totalPages = Math.ceil(_this.totalItems / _this.pageSize);
        });
    };
    AwsImageListComponent.prototype.onPageChange = function (page) {
        this.currentPage = page;
        this.loadImages();
    };
    AwsImageListComponent.prototype.onFileSelected = function (event) {
        this.selectedFile = event.target.files[0];
    };
    AwsImageListComponent.prototype.uploadImage = function () {
        var _this = this;
        this.loadingService.showLoadingOverlay("uploading image .. ", 5000);
        this.awsImageService.uploadImage(this.selectedFile).subscribe(function (response) {
            console.log(response);
            _this.loadingService.hideLoadingOverlay();
            _this.loadImages();
            _this.selectedFile = undefined;
        });
    };
    AwsImageListComponent.prototype.deleteImage = function (imageId) {
        var _this = this;
        this.awsImageService.deleteImage(imageId).subscribe(function () {
            _this.loadImages();
        });
    };
    AwsImageListComponent = __decorate([
        core_1.Component({
            selector: 'app-aws-image-list',
            templateUrl: './aws-image-list.component.html',
            styleUrls: ['./aws-image-list.component.scss']
        })
    ], AwsImageListComponent);
    return AwsImageListComponent;
}());
exports.AwsImageListComponent = AwsImageListComponent;
