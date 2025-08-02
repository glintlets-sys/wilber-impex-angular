"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CartComponent = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("src/environments/environment");
var toaster_1 = require("src/app/services/toaster");
var CartComponent = /** @class */ (function () {
    function CartComponent(router, cartService, userService, authService, modalService, paymentService, encryptionService, loadingService, toaster, catalogService, couponService) {
        this.router = router;
        this.cartService = cartService;
        this.userService = userService;
        this.authService = authService;
        this.modalService = modalService;
        this.paymentService = paymentService;
        this.encryptionService = encryptionService;
        this.loadingService = loadingService;
        this.toaster = toaster;
        this.catalogService = catalogService;
        this.couponService = couponService;
        this.isLoggedIn = false;
        this.userId = '';
        this.cartItems = [];
        this.totalAmount = 0;
        this.discountCode = '';
        this.deliveryAddress = {};
        this.accessCode = "";
        this.orderId = "";
        this.isButtonDisabled = false;
        this.taxPercent = 0;
        this.encryptionRequest = "";
    }
    //This is test code. 
    CartComponent.prototype.checkDisableCondition = function () {
        var shouldDisable = (JSON.parse(localStorage.getItem("userDetails")).username !== "9663747110");
        this.isButtonDisabled = shouldDisable;
    };
    CartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cartService.initCartForLoggedInUser();
        this.authService.isUserLoggedIn.subscribe((function (val) {
            _this.isLoggedIn = (val === "true");
            _this.loadingService.showLoadingOverlay("Loading your cart items ... ", 5000);
            _this.updateCart();
        }));
        //this.updateCart();
        this.authService.userDetails.subscribe(function (val) {
            _this.userId = JSON.parse(val).userId;
        });
        var userDetails = {};
        this.userService.getUserByUsername(JSON.parse(localStorage.getItem("userDetails")).username).subscribe(function (val) {
            userDetails = val;
        });
        // TODO: commenting this for now. Use this method later to upgrade and get this information from backend for the app. So that there can be contingent hold on sales on emergency 
        //this.checkDisableCondition();
        this.accessCode = environment_1.environment.ACCESS_CODE;
    };
    CartComponent.prototype._getSubTotalAmount = function () {
        var subTotal = 0;
        this.cartItems.forEach(function (item) {
            subTotal = subTotal + item.price.amount * item.quantity;
        });
        return subTotal;
    };
    CartComponent.prototype.getSubTotalAmount = function () {
        return this.paymentService.getSubTotalAmount();
    };
    CartComponent.prototype.getTotalTax = function () {
        return this.getSubTotalAmount() * this.taxPercent;
    };
    CartComponent.prototype._getDiscountAmount = function () {
        var subTotalDiscount = 0;
        this.cartItems.forEach(function (item) {
            subTotalDiscount = subTotalDiscount + (item.discount / 100) * item.price.amount * item.quantity;
        });
        return subTotalDiscount;
    };
    CartComponent.prototype.getDiscountAmount = function () {
        return this.paymentService.getDiscountAmount();
    };
    CartComponent.prototype.getTotalAmount = function () {
        return this.paymentService.getTotalAmount();
    };
    CartComponent.prototype.getCouponCodeApplied = function () {
        return this.paymentService.couponCodeApplied;
    };
    CartComponent.prototype.applyCouponCode = function () {
        this.couponCodePass = this.couponCode;
        if (this.paymentService.getCouponDiscount(this.couponCodePass) >= 0) {
            this.toaster.showToast("Coupon Applied.", toaster_1.ToastType.Success);
        }
        else {
            this.toaster.showToast("Invalid Coupon Code", toaster_1.ToastType.Error);
        }
    };
    CartComponent.prototype.getCouponDiscountAmount = function () {
        return this.paymentService.getCouponDiscount(this.couponCodePass);
    };
    CartComponent.prototype.clearCouponCode = function () {
        this.couponCode = undefined;
        this.couponCodePass = undefined;
        this.applyCouponCode();
        this.paymentService.couponCodeApplied = false;
    };
    CartComponent.prototype.updateCart = function () {
        var _this = this;
        this.cartService.getCart().subscribe(function (val) {
            _this.cartItems = val.items;
            _this.catalogService.getCatalogList().subscribe(function (val) {
                _this.catalogItems = val;
            });
            _this.loadingService.hideLoadingOverlay();
        });
    };
    CartComponent.prototype.searchItem = function (itemId) {
        var item = this.catalogItems.find(function (toy) { return toy.id === itemId; });
        if (item) {
            return item.photoLinks[0];
        }
        return undefined;
    };
    CartComponent.prototype.getAccessCode = function () {
        return environment_1.environment.ACCESS_CODE;
    };
    CartComponent.prototype.getEncryptionRequest = function () {
        var _this = this;
        if (this.encryptionRequest == "") {
            var encKey = environment_1.environment.WORKING_KEY;
            var paymentFields = this.paymentService.getPaymentFields(this.orderId); // Get this value from the payment service.
            var requestData = this.constructRequestData(paymentFields);
            this.encryptionService.encryptData(requestData).subscribe(function (data) {
                _this.encryptionRequest = data.encryptedRequest;
                //  console.log("Encrypted data" + this.encryptionRequest);
            }, function (error) {
                console.error(error);
            });
        }
    };
    /**
     * New code begins.
     *
     *
     */
    /**
     *  S T E P S   T O   P R O C E S S   P A Y M E N T
     *
     * AUTH SERVICE
     * Review the auth service and clean it up to start.  -- done
     * Clean up cart - need not use the local storage at all -- done
     *
     * UPDATES TO CART MANAGMENT -- done ( scheduler is stil missing - out of stock is still missing.)
     *
     * 1. Ensure the items are locked when an item is added to cart.  -- done
     * 2. If an item cannot be locked, these items need to show as out of stock. Add remove add to cart button and show out of stock message on the item.  - done
     * 3. Handle the case when an item quantity is increased. - in this case just show the toaster message and do not increase the quantity in the cart. -- done
     * 4. Ensure that when an item is added to the cart, its corresponding stock item is locked for cart & add to cart indicator clearly shows that.  -- done
     * 5. Stock status is updated from available to added to cart . user id is capured along with when it was added.  -- done
     * 6. cart need not store anything in the localstorage its unwanted overhead.  -- done
     * 7. when scheduler runs, it checks items in cart and if any of them ar expired just remove them from the lock of the customer.   -- tbd. Code available but need to check. Also need to impleemnt optimistic lock.
     * 8. Cart should store any cart summary at all. Cart summary should be built cached and sent to customer. storing this leads to inconsistencies. its rather simpler design. And is clearly doing all the work.
     *  when i move the stock to processing payment and then subsequently to payment success , along with the user name is quite a clean design.  -- done.
     *
     *
     * ON PROCEED TO PAYMENT
     *
     * 1. When user initiate a call to proceed to payment.
     *    -> update the cart -> to ensure if there is any inconsistency. This is rare case scenario - throw a toaster and stop the process. - done.
     *    -> if no discripancy
     *        -> call -> proceed to payment backend service.
     *            -> send the payment summary json to backend.
     *                      -> sumamry is just not the stock details. its about
     *                            -> discounts applied to a stock.
     *                            -> actual price the item is sold.
     *                            -> actual tax collected on the stock.
     *                            -> any thing further such as free items etc in future design perspective.
     *                            -> captures the address to which this item to be delivered.
     *                  -> store the payment summary ang generate a order number. Populate the order number as id of customer + item ids of the items he purchased + date & time ( with the help of summary ) - encrypt to base64
     *            -> this api should update the stock table against the user to -> mark for purchase. So these items cannot be deleted by any scheduler.
     *            -> update the stock items with the order number.
     *            -> respond with order number back to the calling api on front end  - done
     *    -> if it fails
     *          -> throw error.
     *          -> if success
     *              -> get the encryption summary for payment
     *                    -> encrypt it.
     *              -> redirect to payment gateway with order id. -- next step.
     *    -> if the payment completes
     * 2. Recieve redirect to the payment-response service.
     *      -> if success
     *            -> mark the purchase summary to sucess. date and time. with amont recieved. As this may be different from requested amount. There is a deduction at the payment gateway.
     *            -> update stock table with ths order number items marked as sold.
     *       -> if failure.
     *            -> No need to delete the order number row in the payment summary table. Mark the order number as failed.
     *            -> remove mark on the stock back to add to cart against this order number.
     *
     *        -> a scheduler can clear all order entries and do teh above 2 operation if the time of order placed is more than 2 hours ( this is to handle the failed payment in transit and release the held up stock.) this scheduler should run every 5 mins.
     *
     *
     *        -> redirect back to the UI based on sucess or failure. Navigate to order page.
     *
     * 3. Order page
     *      1. should simply display table from
     *              -> order summary
     *                      order id, order status ( success or processing payment or failed payment etc. ),
     *
     *      2. create a order detail table and keep pushing data against this order.
     *              -> this table will ahve only creates no updates.
     *              -> display the events in this table such as
     *                    -> preparing for dispatch
     *                    -> waiting to collect.
     *                    -> dispatched with order details.
     *                    -> order delivered confirmation etc.
     *                    -> if possible any feeds from the scheduler from the courier gateway service.
     *
     * */
    CartComponent.prototype.processPayment_new = function () {
        var _this = this;
        this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
        this.cartService.getCart().subscribe(function (cartOld) {
            // Copy the old cart
            var oldCart = JSON.parse(JSON.stringify(cartOld));
            // Refresh the cart
            _this.cartService.initCartForLoggedInUser();
            // Get the new cart
            _this.cartService.getCart().subscribe(function (cartNew) {
                // Compare the old cart to the new cart
                if (JSON.stringify(cartNew) !== JSON.stringify(oldCart)) {
                    _this.loadingService.hideLoadingOverlay();
                    _this.toaster.showToast("Some of the cart items are out of stock. Please review and proceed for payment", toaster_1.ToastType.Error, 5000);
                }
                else {
                    // this.toaster.showToast("The cart is upto date. All items in stock!", ToastType.Success, 3000);
                    // proceeding to store the purchase summary and generating the order id for payment redirect.  
                    _this.paymentService.initiatePayment().subscribe(function (response) {
                        // Handle the response here
                        _this.orderId = response;
                        console.log("Order id: " + _this.orderId);
                        // Now that the order details are stored. Initiate the payment. 
                        _this.processPayment();
                    }, function (error) {
                        // Handle any errors that occur during the request
                        console.error('Error:', error);
                        _this.toaster.showToast("Something went Wrong. We are sorry. Please retry or reach out to us at glintlets@gmail.com", toaster_1.ToastType.Error, 10000);
                    });
                    ;
                    _this.loadingService.hideLoadingOverlay();
                }
            });
        });
    };
    /**
     * New code ends
     */
    // Function to process payment
    CartComponent.prototype.processPayment = function () {
        var _this = this;
        var ccavenueForm = document.getElementById('ccavenueForm');
        this.getEncryptionRequest(); // make sure this is called to get the rquried data before we actually submit. 
        this.loadingService.showLoadingOverlay("Redirecting to payment gateway", 4000);
        setTimeout(function () {
            ccavenueForm.submit();
            _this.loadingService.hideLoadingOverlay();
        }, 2000); // Delay of 1 second (1000 milliseconds)
    };
    CartComponent.prototype.constructRequestData = function (paymentFields) {
        var merchantId = paymentFields.merchantId, orderId = paymentFields.orderId, currency = paymentFields.currency, amount = paymentFields.amount, redirectUrl = paymentFields.redirectUrl, cancelUrl = paymentFields.cancelUrl, language = paymentFields.language;
        var requestData = "merchant_id=" + merchantId;
        // Construct required fields
        var requiredData = this.constructRequiredData(paymentFields);
        requestData += "&" + requiredData;
        // Construct optional fields
        var optionalData = this.constructOptionalData(paymentFields);
        if (optionalData !== '') {
            requestData += "&" + optionalData;
        }
        return requestData;
    };
    CartComponent.prototype.constructRequiredData = function (paymentFields) {
        var orderId = paymentFields.orderId, currency = paymentFields.currency, amount = paymentFields.amount, redirectUrl = paymentFields.redirectUrl, cancelUrl = paymentFields.cancelUrl, language = paymentFields.language;
        var requiredData = "order_id=" + orderId + "&currency=" + currency + "&amount=" + amount + "&redirect_url=" + redirectUrl + "&cancel_url=" + cancelUrl + "&language=" + language;
        return requiredData;
    };
    CartComponent.prototype.constructOptionalData = function (paymentFields) {
        var billingName = paymentFields.billingName, billingAddress = paymentFields.billingAddress, billingCity = paymentFields.billingCity, billingState = paymentFields.billingState, billingZip = paymentFields.billingZip, billingCountry = paymentFields.billingCountry, billingTel = paymentFields.billingTel, billingEmail = paymentFields.billingEmail, deliveryName = paymentFields.deliveryName, deliveryAddress = paymentFields.deliveryAddress, deliveryCity = paymentFields.deliveryCity, deliveryState = paymentFields.deliveryState, deliveryZip = paymentFields.deliveryZip, deliveryCountry = paymentFields.deliveryCountry, deliveryTel = paymentFields.deliveryTel, merchantParam1 = paymentFields.merchantParam1, merchantParam2 = paymentFields.merchantParam2, merchantParam3 = paymentFields.merchantParam3, merchantParam4 = paymentFields.merchantParam4, merchantParam5 = paymentFields.merchantParam5, promoCode = paymentFields.promoCode, tid = paymentFields.tid;
        var optionalData = '';
        if (billingName)
            optionalData += "billing_name=" + billingName + "&";
        if (billingAddress)
            optionalData += "billing_address=" + billingAddress + "&";
        if (billingCity)
            optionalData += "billing_city=" + billingCity + "&";
        if (billingState)
            optionalData += "billing_state=" + billingState + "&";
        if (billingZip)
            optionalData += "billing_zip=" + billingZip + "&";
        if (billingCountry)
            optionalData += "billing_country=" + billingCountry + "&";
        if (billingTel)
            optionalData += "billing_tel=" + billingTel + "&";
        if (billingEmail)
            optionalData += "billing_email=" + billingEmail + "&";
        if (deliveryName)
            optionalData += "delivery_name=" + deliveryName + "&";
        if (deliveryAddress)
            optionalData += "delivery_address=" + deliveryAddress + "&";
        if (deliveryCity)
            optionalData += "delivery_city=" + deliveryCity + "&";
        if (deliveryState)
            optionalData += "delivery_state=" + deliveryState + "&";
        if (deliveryZip)
            optionalData += "delivery_zip=" + deliveryZip + "&";
        if (deliveryCountry)
            optionalData += "delivery_country=" + deliveryCountry + "&";
        if (deliveryTel)
            optionalData += "delivery_tel=" + deliveryTel + "&";
        if (merchantParam1)
            optionalData += "merchant_param1=" + merchantParam1 + "&";
        if (merchantParam2)
            optionalData += "merchant_param2=" + merchantParam2 + "&";
        if (merchantParam3)
            optionalData += "merchant_param3=" + merchantParam3 + "&";
        if (merchantParam4)
            optionalData += "merchant_param4=" + merchantParam4 + "&";
        if (merchantParam5)
            optionalData += "merchant_param5=" + merchantParam5 + "&";
        if (promoCode)
            optionalData += "promo_code=" + promoCode + "&";
        if (tid)
            optionalData += "tid=" + tid;
        return optionalData;
    };
    // Function to log in
    CartComponent.prototype.login = function () {
        var currentUrl = this.router.url;
        var redirectUrl = "/login?returnUrl=" + encodeURIComponent(currentUrl);
        this.router.navigateByUrl(redirectUrl);
    };
    CartComponent.prototype.getIsLoggedIn = function () {
        var _this = this;
        this.authService.isUserLoggedIn.subscribe((function (val) {
            _this.isLoggedIn = (val === "true");
        }));
        return this.isLoggedIn;
    };
    CartComponent.prototype.removeItem = function (cartItem) {
        this.cartService.deleteCartItem(Number(this.userId), cartItem.itemId).subscribe(function (val) {
            if (val) {
                cartItem.quantity = 0;
            }
        });
    };
    CartComponent.prototype.incrementQuantity = function (cartItem) {
        var cartItemCopy = JSON.parse(JSON.stringify(cartItem));
        cartItemCopy.quantity++;
        this.cartService.addToCart(Number(this.userId), cartItemCopy).subscribe(function (val) {
            if (val) {
                //cartItem.quantity++;
            }
            else {
                cartItem.quantity--;
            }
        });
    };
    CartComponent.prototype.decrementQuantity = function (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            this.cartService.addToCart(Number(this.userId), cartItem).subscribe(function (val) {
                if (val) {
                    // cartItem.quantity--;
                }
                else {
                    cartItem.quantity++;
                }
            });
        }
    };
    CartComponent = __decorate([
        core_1.Component({
            selector: 'app-cart',
            templateUrl: './cart.component.html',
            styleUrls: ['./cart.component.scss']
        })
    ], CartComponent);
    return CartComponent;
}());
exports.CartComponent = CartComponent;
