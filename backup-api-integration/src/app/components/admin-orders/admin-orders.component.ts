import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderDTO } from 'src/app/services/order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ShiprocketService } from 'src/app/services/shiprocket/shiprocket.service';
import { DispatchService } from 'src/app/services/dispatch.service';
import { DispatchSummary } from 'src/app/services/dispatchSummary';
import { LoadingOverlayService } from 'src/app/services/loading-overlay.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent {

  orders: OrderDTO[];
  userId: string;

  constructor(private orderService: OrderService,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingOverlayService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService, 
    private dispatchService: DispatchService) {

    this.route.params.subscribe(params => {
      if (params['status'] == "failure") {
        this.router.navigate(['/checkout']);
        toaster.showToast("Payment failed. Please try again", ToastType.Error, 3000);
      } else if (params['success'] == "success") {
        // alertService.setSuccess("Payment Successful");
        toaster.showToast("Your order has been placed succefully.", ToastType.Success, 3000);
      }
    });
  }

  ngOnInit(): void {
    const currentUser = this.authenticationService.getUserId();
    if (currentUser) {
      this.userId = currentUser;
      this.loadOrders();
    }
  }

  getFormattedAddress(order: any) {
    let summary = this.getOrderAddress(order.purchaseSummary)
    let address = summary.address
    return address.firstLine + " " + address.secondLine + " " + "\n" + address.city + " " + address.state + " " + address.country + " " + address.pincode + "\n" + address.emailAddress + "\n" + address.mobileNumber;
  }

  toggleOrderDetails(order: OrderDTO): void {
    order.showDetails = !order.showDetails;
  }

  showItemsTable(order: OrderDTO) {
    order.showItemsTable = !order.showItemsTable;
  }

  toggleShipmentDetails(order: OrderDTO) {
    order.showShipmentDetails = !order.showShipmentDetails;
  }

  currentPage = 0;
  requestedCount = 10;
  totalCount: number ;
  numberOfResults: number = 0; 
  totalPages = 0;

  loadOrders(): void {
    this.loadingService.showLoadingOverlay("Loading.. ",5000);
    this.orderService.getAdminOrders(this.currentPage, this.requestedCount).subscribe(
      (response: HttpResponse<OrderDTO[]>) => {
        this.orders = response.body || [];

        console.log("Headers: " + JSON.stringify(response.headers));
        const totalCountHeader = response.headers.get('Total-Count');
        const totalPagesHeader = response.headers.get('Total-Pages');
        this.numberOfResults = totalCountHeader ? +totalCountHeader : 0;
        const totalPages = totalPagesHeader ? +totalPagesHeader : 0;
        this.totalPages = totalPages;
        this.loadingService.hideLoadingOverlay();
      },
      error => {
        console.error(error);
        this.loadingService.hideLoadingOverlay();
      }
    );
  }

  hasSentToShippingProvider(order: OrderDTO)
  {
   // console.log("shipment id : " + order.dispatchSummary.shipmentId);
    return !(order.dispatchSummary.shipmentId)
  }

  sendToShippingProvider(order:OrderDTO)
  {
    this.loadingService.showLoadingOverlay("Loading...", 3000);
    this.dispatchService.sendToShippingProvider(order).subscribe((val: DispatchSummary)=>{
      order.dispatchSummary = val;
      this.loadingService.hideLoadingOverlay();
      order.showShipmentDetails = true;
      this.toaster.showToast("order has been sent to shipping service. Shipping id: " + val.shipmentId, ToastType.Success);
    });
  }

  loadPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadOrders();
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadOrders();
    } else {
      this.toaster.showToast("No more pages left", ToastType.Info, 3000);
    }
  }

  getPaymentStatus(status: string) {
    let paymentStatus = "";
    if (status === "PAYMENTSUCCESS") {
      return "Payment Success";
    }
    if (status === "PAYMENTINITIATED") {
      return "Payment was not completed ";
    }
    if (status === "PAYMENTFAILED") {
      return "Payment Failed";
    }
  }

  getDispatchStatus(status: string) {
    let dispatchStatus = "";
    if (status === "READYTODISPATCH") {
      return "Ready to Dispatch";
    }
    if (status === "DISPACHED") {
      return "Item has been dispatched";
    }
    if (status === "DELIVERED") {
      return "item has been delivered."
    }
  }

  getPurchaseSummary(summary: string) {
    return JSON.parse(summary);
  }

  getOrderAddress(address: string) {
    return JSON.parse(address);
  }


  getOrderString() {
    let ordersString: string = JSON.stringify(this.orders, null, 2);
    return ordersString;
  }

  navigateToInvoice(order) {
    console.log(order);
    const invoiceUrl = `/invoice/${order.id}`;
    this.router.navigate([]).then(result => { window.open(invoiceUrl, '_blank'); });
  }

}