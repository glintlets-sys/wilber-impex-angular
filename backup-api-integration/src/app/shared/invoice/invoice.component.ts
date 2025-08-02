import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CartItem } from 'src/app/services/cart.service';
import { OrderDTO } from 'src/app/services/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class InvoiceComponent implements OnInit {
  orders: any;
  json_purchase_summary: any = '';
  paymentResponse: any = {};

  constructor(private router: Router, private order_service: OrderService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const parts = event.urlAfterRedirects.split('/');
      const valueAfterLastSlash = parts[parts.length - 1];
      this.loadOrder(valueAfterLastSlash)
    });
  }

  ngOnInit(): void {

  }

  math: Math;

  getItemTax(item: CartItem) {
    let mrp: number = item?.price?.amount * item?.quantity;
   // console.log("MRP" + mrp);
    let preTax: number = mrp / ( 1 + ((item?.tax?item?.tax:0)/100));
 //   console.log("Pretax" + preTax);
    return mrp-preTax;
  }

  getItemTotalPrice(item: CartItem) {
    return  item?.price?.amount * item?.quantity;;
  }

  round(val) {
    return Math.round(val);
  }

  getPaymentMode()
  {
    return this.paymentResponse.data.paymentInstrument.type;
  }

  getTransactionId()
  {
    return this.paymentResponse.data.transactionId;
  }

  getInvoiceValue()
  {
    return (this.paymentResponse.data.amount)/100;

  }

  getOrderDate()
  {
    return this.orders?.creationDate; 
  }

  getPlaceOfSupply()
  {
    return "Karnataka";
  }

  getPlaceOfDelivery()
  {
    return this.json_purchase_summary?.audit?.gstState;
  }

  loadOrder(order) {
    this.order_service.getOrdersById(order).subscribe(val => {
      this.orders = val;
     // console.log(JSON.stringify(this.orders));
      this.json_purchase_summary = JSON.parse(this.orders?.purchaseSummary)
      this.paymentResponse = JSON.parse(this.orders?.paymentResponse);
      //console.log(JSON.stringify(this.json_purchase_summary));
    });
  }


}
