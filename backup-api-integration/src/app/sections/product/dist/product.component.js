"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductComponent = void 0;
var core_1 = require("@angular/core");
var carousel_modal_component_1 = require("src/app/shared/carousel-modal/carousel-modal.component");
var ProductComponent = /** @class */ (function () {
    function ProductComponent(authService, catalogService, cartService, route, location, modalService, router) {
        var _this = this;
        this.authService = authService;
        this.catalogService = catalogService;
        this.cartService = cartService;
        this.route = route;
        this.location = location;
        this.modalService = modalService;
        this.router = router;
        this.quantity = 1;
        this.stockCount = 0;
        this.addedToCartFlag = false;
        this.authService.isUserLoggedIn.subscribe(function (val) {
            _this.isUserLoggedIn = val;
        });
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
    }
    ProductComponent.prototype.openCarouselModal = function (photoLinks, title) {
        var modalRef = this.modalService.open(carousel_modal_component_1.CarouselModalComponent, { size: 'lg' });
        modalRef.componentInstance.photoLinks = photoLinks;
        modalRef.componentInstance.title = title;
        this.modalRef = modalRef;
        // Subscribe to the modal's afterDismissed event to handle actions after the modal is closed
        modalRef.closed.subscribe(function (result) {
            // Handle any actions after the modal is closed (if needed)
        });
    };
    ProductComponent.prototype.hasUserLoggedIn = function () {
        return this.isUserLoggedIn === "true";
    };
    ProductComponent.prototype.getPhotoLink = function (i) {
        return this.getItem().photoLinks[i];
    };
    ProductComponent.prototype.calculateDiscountedPrice = function (amount, percentVal) {
        return amount * ((100 - percentVal) / 100);
    };
    ProductComponent.prototype.increaseQuantity = function () {
        // TODO: 
        /**
         * We really need to have a logic as to how many is the max items a customer can buy.
         *  1. one we need this number as part of the item data itself. -- TODO.
         *  2. what if this is a return gift so these items can be more in number even in 100s too. So this number is always pulled from the item.
         *  3. Another imp question is how many can i lock.. i think there is no specific logic for locking.
         * but the time to keep an item locked for a user needs to be specified in the item too. This is also important. if the quantity is more the time to wait need not be more. As its blocking the other customer from buying.
         * Like just wait for 2 mins or so to buy if the order is more than 50 items.
         */
        var _a;
        if (this.quantity < 4) {
            this.quantity++;
        }
        if (this.addedToCartFlag) {
            this.cartService.addToCart(Number(this.authService.getUserId()), {
                "id": undefined,
                "itemId": this.item.id,
                "name": this.item.name,
                "quantity": Number(this.quantity),
                "tax": 18,
                "price": this.item.price.amount,
                "discount": (_a = this.item.discount) === null || _a === void 0 ? void 0 : _a.discountPercent
            });
        }
    };
    ProductComponent.prototype.decreaseQuantity = function () {
        var _a;
        if (this.quantity > 1) {
            this.quantity--;
        }
        else if (this.quantity > 0) {
            this.quantity = 1;
            this.cartService.removeFromCart(Number(this.authService.getUserId()), Number(this.itemId));
            // TODO: show a toaster 
            this.addedToCartFlag = false;
        }
        if (this.addedToCartFlag) {
            this.cartService.addToCart(Number(this.authService.getUserId()), {
                "id": undefined,
                "itemId": this.item.id,
                "name": this.item.name,
                "quantity": Number(this.quantity),
                "price": this.item.price,
                "tax": 18,
                "discount": (_a = this.item.discount) === null || _a === void 0 ? void 0 : _a.discountPercent
            });
        }
    };
    ProductComponent.prototype.isAddedToCart = function () {
        var _this = this;
        this.cartService.isItemInCartFromItemId(this.item.id).subscribe(function (val) {
            _this.addedToCartFlag = val;
        });
        return this.addedToCartFlag;
    };
    ProductComponent.prototype.nextItemId = function () {
        var _this = this;
        if (this.nextItem == undefined) {
            this.catalogService.getNextItem(this.item.id).subscribe(function (val) {
                _this.nextItem = val;
            });
        }
        return this.nextItem.id;
    };
    ProductComponent.prototype.addToCart = function () {
        // just delegate to add to cart service. 
        var _this = this;
        var _a;
        var addedFlag;
        this.cartService.addToCart(Number(this.authService.getUserId()), {
            "id": undefined,
            "itemId": this.item.id,
            "name": this.item.name,
            "quantity": Number(this.quantity),
            "tax": 18,
            "price": this.item.price,
            "discount": (_a = this.item.discount) === null || _a === void 0 ? void 0 : _a.discountPercent
        }).subscribe(function (val) {
            addedFlag = val;
            if (addedFlag) {
                _this.addedToCartFlag = true;
            }
        });
    };
    ProductComponent.prototype.getItem = function () {
        var _this = this;
        if (this.item == undefined) {
            this.catalogService.getCatalogItem(this.itemId).subscribe(function (data) {
                _this.item = data;
            });
        }
        return this.item;
    };
    // ########################
    ProductComponent.prototype.ngOnInit = function () {
        var _this = this;
        var body = document.getElementsByTagName("body")[0];
        body.classList.add("product-page");
        this.itemId = this.route.snapshot.paramMap.get('itemId');
        this.catalogService.getStockCount(this.itemId).subscribe(function (val) {
            _this.stockCount = val;
        });
        this.catalogService.fetchStockCount(this.itemId);
        var cartItem = this.cartService.getCartItem({ "id": undefined, "itemId": this.itemId, "name": "", "quantity": 0, "tax": 0, "price": 0, "discount": 0 });
        if (cartItem !== undefined) {
            this.quantity = cartItem.quantity;
            this.addedToCartFlag = true;
        }
        this.cartService.isItemInCart(cartItem).subscribe(function (val) {
            _this.addedToCartFlag = val;
        });
    };
    ProductComponent.prototype.hasDiscount = function (discount) {
        if ((discount == null) || (discount == undefined) || (discount.discountPercent == 0)) {
            return false;
        }
        return true;
    };
    ProductComponent.prototype.goBack = function () {
        this.location.back();
    };
    ProductComponent.prototype.getStockCount = function () {
        return this.stockCount;
    };
    ProductComponent.prototype.navigateToCatalog = function () {
        this.router.navigate(['/']);
    };
    ProductComponent.prototype.navigateToNextItem = function () {
        var _this = this;
        var nextItemId = this.nextItemId();
        this.router.navigate(['/product', this.nextItemId()]).then(function () {
            _this.location.replaceState("/product/" + nextItemId);
            location.reload();
        });
    };
    ProductComponent.prototype.navigateToLogin = function () {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    };
    ProductComponent.prototype.navigateToCheckout = function () {
        this.router.navigate(['/checkout']);
    };
    ProductComponent.prototype.ngOnDestroy = function () {
        var body = document.getElementsByTagName("body")[0];
        body.classList.remove("product-page");
    };
    ProductComponent = __decorate([
        core_1.Component({
            selector: "app-product",
            templateUrl: "product.component.html",
            styleUrls: ['./product.component.scss']
        })
    ], ProductComponent);
    return ProductComponent;
}());
exports.ProductComponent = ProductComponent;
