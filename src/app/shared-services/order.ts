export class OrderDTO {
  id: number;
  username: string;
  userId: string;
  paymentStatus: PaymentStatus;
  purchaseSummary: string;
  showDetails: boolean;
  showShipmentDetails: boolean;
  showItemsTable: boolean = false;
  showStatusDropdown: boolean = false;
  dispatchSummary: any;
  creationDate?: Date;
}

export enum PaymentStatus {
  PAYMENTINITIATED = 0,
  PAYMENTFAILED = 1,
  PAYMENTSUCCESS = 2
}

export class OrderedItem {
  orderId:number;
  id: number;
  itemName: string;
  price:number;
  Image: string;
  creationDate: Date;
  shipmentStatus: string;
  variationId: string;
}

