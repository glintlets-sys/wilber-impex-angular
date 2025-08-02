"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrdersComponent = void 0;
var core_1 = require("@angular/core");
var toaster_1 = require("src/app/services/toaster");
var OrdersComponent = /** @class */ (function () {
    function OrdersComponent(orderService, authenticationService, router, route, toaster) {
        var _this = this;
        this.orderService = orderService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.route = route;
        this.toaster = toaster;
        this.route.params.subscribe(function (params) {
            if (params['status'] == "failure") {
                _this.router.navigate(['/checkout']);
                toaster.showToast("Payment failed. Please try again", toaster_1.ToastType.Error, 10000);
            }
            else if (params['success'] == "success") {
                // alertService.setSuccess("Payment Successful");
                toaster.showToast("Your order has been placed succefully.", toaster_1.ToastType.Success, 10000);
            }
        });
    }
    OrdersComponent.prototype.ngOnInit = function () {
        var currentUser = this.authenticationService.getUserId();
        if (currentUser) {
            this.userId = currentUser;
            this.loadOrders();
        }
    };
    OrdersComponent.prototype.getFormattedAddress = function (order) {
        var summary = this.getOrderAddress(order.purchaseSummary);
        var address = summary.address;
        return address.firstLine + " " + address.secondLine + " " + "\n" + address.city + " " + address.state + " " + address.country + " " + address.pincode + "\n" + address.emailAddress + "\n" + address.mobileNumber;
    };
    OrdersComponent.prototype.toggleOrderDetails = function (order) {
        order.showDetails = !order.showDetails;
    };
    OrdersComponent.prototype.showItemsTable = function (order) {
        order.showItemsTable = !order.showItemsTable;
    };
    OrdersComponent.prototype.toggleShipmentDetails = function (order) {
        order.showShipmentDetails = !order.showShipmentDetails;
    };
    OrdersComponent.prototype.loadOrders = function () {
        var _this = this;
        this.orderService.getOrders(this.userId).subscribe(function (orders) { return _this.orders = orders; }, function (error) { return console.error(error); });
    };
    OrdersComponent.prototype.getPaymentStatus = function (status) {
        var paymentStatus = "";
        if (status === "PAYMENTSUCCESS") {
            return "Payment Success";
        }
        if (status === "PAYMENTINITIATED") {
            return "Payment was not completed ";
        }
        if (status === "PAYMENTFAILED") {
            return "Payment Failed";
        }
    };
    OrdersComponent.prototype.getDispatchStatus = function (status) {
        var dispatchStatus = "";
        if (status === "READYTODISPATCH") {
            return "Ready to Dispatch";
        }
        if (status === "DISPATCHED") {
            return "Item has been dispatched";
        }
        if (status === "DELIVERED") {
            return "item has been delivered.";
        }
    };
    OrdersComponent.prototype.getPurchaseSummary = function (summary) {
        return JSON.parse(summary);
    };
    OrdersComponent.prototype.getOrderAddress = function (address) {
        return JSON.parse(address);
    };
    OrdersComponent.prototype.getOrderString = function () {
        var ordersString = JSON.stringify(this.orders, null, 2);
        return ordersString;
    };
    OrdersComponent = __decorate([
        core_1.Component({
            selector: 'app-orders',
            templateUrl: './orders.component.html',
            styleUrls: ['./orders.component.scss']
        })
    ], OrdersComponent);
    return OrdersComponent;
}());
exports.OrdersComponent = OrdersComponent;
