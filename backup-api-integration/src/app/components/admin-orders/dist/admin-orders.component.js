"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminOrdersComponent = void 0;
var core_1 = require("@angular/core");
var toaster_1 = require("src/app/services/toaster");
var AdminOrdersComponent = /** @class */ (function () {
    function AdminOrdersComponent(orderService, authenticationService, router, route, toaster) {
        var _this = this;
        this.orderService = orderService;
        this.authenticationService = authenticationService;
        this.router = router;
        this.route = route;
        this.toaster = toaster;
        this.currentPage = 0;
        this.totalCount = 50;
        this.totalPages = 0;
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
    AdminOrdersComponent.prototype.ngOnInit = function () {
        var currentUser = this.authenticationService.getUserId();
        if (currentUser) {
            this.userId = currentUser;
            this.loadOrders();
        }
    };
    AdminOrdersComponent.prototype.getFormattedAddress = function (order) {
        var summary = this.getOrderAddress(order.purchaseSummary);
        var address = summary.address;
        return address.firstLine + " " + address.secondLine + " " + "\n" + address.city + " " + address.state + " " + address.country + " " + address.pincode + "\n" + address.emailAddress + "\n" + address.mobileNumber;
    };
    AdminOrdersComponent.prototype.toggleOrderDetails = function (order) {
        order.showDetails = !order.showDetails;
    };
    AdminOrdersComponent.prototype.showItemsTable = function (order) {
        order.showItemsTable = !order.showItemsTable;
    };
    AdminOrdersComponent.prototype.toggleShipmentDetails = function (order) {
        order.showShipmentDetails = !order.showShipmentDetails;
    };
    AdminOrdersComponent.prototype.loadOrders = function () {
        var _this = this;
        this.orderService.getAdminOrders(this.currentPage, this.totalCount).subscribe(function (response) {
            _this.orders = response.body || [];
            var totalCountHeader = response.headers.get('Total-Count');
            var totalPagesHeader = response.headers.get('Total-Pages');
            var totalCount = totalCountHeader ? +totalCountHeader : 0;
            var totalPages = totalPagesHeader ? +totalPagesHeader : 0;
            // Update the total pages based on the extracted values
            _this.totalCount = totalCount;
            _this.totalPages = totalPages;
        }, function (error) {
            console.error(error);
        });
    };
    AdminOrdersComponent.prototype.loadPreviousPage = function () {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.loadOrders();
        }
    };
    AdminOrdersComponent.prototype.loadNextPage = function () {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.loadOrders();
        }
        else {
            this.toaster.showToast("No more pages left", toaster_1.ToastType.Info, 10000);
        }
    };
    AdminOrdersComponent.prototype.getPaymentStatus = function (status) {
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
    AdminOrdersComponent.prototype.getDispatchStatus = function (status) {
        var dispatchStatus = "";
        if (status === "READYTODISPATCH") {
            return "Ready to Dispatch";
        }
        if (status === "DISPACHED") {
            return "Item has been dispatched";
        }
        if (status === "DELIVERED") {
            return "item has been delivered.";
        }
    };
    AdminOrdersComponent.prototype.getPurchaseSummary = function (summary) {
        return JSON.parse(summary);
    };
    AdminOrdersComponent.prototype.getOrderAddress = function (address) {
        return JSON.parse(address);
    };
    AdminOrdersComponent.prototype.getOrderString = function () {
        var ordersString = JSON.stringify(this.orders, null, 2);
        return ordersString;
    };
    AdminOrdersComponent = __decorate([
        core_1.Component({
            selector: 'app-admin-orders',
            templateUrl: './admin-orders.component.html',
            styleUrls: ['./admin-orders.component.scss']
        })
    ], AdminOrdersComponent);
    return AdminOrdersComponent;
}());
exports.AdminOrdersComponent = AdminOrdersComponent;
