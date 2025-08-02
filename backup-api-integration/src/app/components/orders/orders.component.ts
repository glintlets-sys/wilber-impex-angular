import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderDTO, OrderedItem } from 'src/app/services/order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { ToastType } from 'src/app/services/toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { ToyService } from 'src/app/services/toy.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderDTO[];
  userId: string;
  orderedItems: OrderedItem[] = [];
  tableSize = environment.tableSize;
  page: number = 1;
  count: number = 0;
  staticOrder: OrderedItem[] = [];
  searchOrder: any = "";

  orderStatus = {
    OnTheWay: "On the way",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    Returned: "Returned"
  };

  orderTimes = {
    LastThirtyDays: '30',
  }

  myDate = new Date();

  constructor(private orderService: OrderService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToasterService, private toyService: ToyService) {

    this.route.params.subscribe(params => {
      if (params['status'] == "failure") {
        this.router.navigate(['/checkout']);
        toaster.showToast("Payment failed. Please try again", ToastType.Error, 3000);
      } else if (params['success'] == "success") {
        // alertService.setSuccess("Payment Successful");
      }
    });
  }

  ngOnInit(): void {
    const currentUser = this.authenticationService.getUserId();
    if (currentUser) {
      this.userId = currentUser;
      // this.loadOrders();
      this.loadOrderedItems();
    }
  }

  orderTime: { [key: number]: string } = { 0: 'Last 30 days' };

  loadOrderedItems(): void {
    // Subscribe to the API call
    this.orderService.getOrderedItems(this.userId).subscribe(
      (orderedItems: OrderedItem[]) => {
        this.orderedItems = orderedItems.reverse();


        // Store order time 
        this.orderedItems.forEach(order => {
          const year = new Date(order.creationDate).getFullYear();
          if (!this.orderTime[year]) {
            this.orderTime[year] = year.toString();
          }
        });

        this.staticOrder = [... this.orderedItems];
        this.count = this.orderedItems?.length;
      },
      (error: any) => {
        console.error('Component: Error fetching ordered items:', error);
      }
    );
  }

  getItemImg(id: number) {
    return this.toyService.getToyByIdNonObj(id)?.thumbnail;
  }

  getItem(id: number) {
    return this.toyService.getToyByIdNonObj(id);
  }

  getColor(order: OrderedItem): string {

    let variationId = order.variationId;
    if(variationId ==null) {
      return null;
    }
    
    let variations : any[]= this.getItem(order.id).variations;

    let variation = variations.find(variation=>{
      return variation.id === variationId;
    })

    if(variation!==null) {
      return variation;
    }
    return null;

  }

  formatStatus(status: string)
  {
    if(status === 'READYTODISPATCH') {
      return "Ready to dispatch";
    } else if(status === 'DISPATCHED') {
      return "Item Dispatched";
    } else if(status == 'DELIVERED') {
      return "Delivered"
    }
    return null;
  }

  filterOder(): void {
    this.orderedItems = this.staticOrder.filter(order =>
      order.itemName.toLowerCase().includes(this.searchOrder.toLowerCase())
    );
    this.count = this.orderedItems?.length;
    this.page = 1;

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
    if (status === "DISPATCHED") {
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
    const invoiceUrl = `/invoice/${order.id}`;
    this.router.navigate([]).then(result => { window.open(invoiceUrl, '_blank'); });
  }

  openProduct(itemId) {
    this.router.navigate(['product', itemId]);
  }

}
