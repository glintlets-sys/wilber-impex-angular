export interface Stock {
  id: number;
  consignmentId: number;
  itemId: number;
  stockStatus: number;
  creationDate: Date;
  availableFromDate: Date;
  variationId: number;
  userId: number;
  lockedStock: boolean;
  lockDate: Date;
  name: string,
  brand:string
}

export enum StockStatus {
  READY = 0,
  ACTIVE = 1,
  ADDEDTOCART = 2,
  SOLD = 3,
  INITIATINGPURCHASE = 4
}


export interface ItemStock {
  name: string;
  itemId: number;
  quantity: number;
  usnCode?: string;
  itemCode?: number;
  presentCost?:number;
  locked: number;
  active: number;
  ready: number;
  addedToCart: number;
  sold:number ;
  brand:string
}
