export interface StockConsignment {
  id: number;
  dealer: Dealer;
  purchaseDate: Date;
  consignmentCost?: Price;
  consignmentItem?: ConsignmentItem[];
  invoiceImage?: URL;
  invoiceNumber?: number;
  shippingCost?: Price;
  stockCreated?: boolean;
  stockCreatedOn?: Date;
}

export interface Dealer {
  id: number;
  dealerName: string;
  address: Address;
}

export interface ConsignmentItem {
  sno?: number;
  id?: number;
  itemId?: number; //
  purchasePrice?: Price; //
  margin?: Price;
  shippingCost?: Price;
  quantity: number; //
  itemName?: string;
  usnNumber?: string;
  itemCode?: any;
  presentCost?: number;
  presentQuantity?: number;
  newStockQuantity?: number;
  variationId?: number;
  // price?:any;
}

export interface Price {
  id?: number;
  amount: number;
  currency?: Currency;
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
}

export interface Address {
  id: number;
  firstLine: string;
  secondLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mobileNumber: string;
  alternateNumber: string;
  emailAddress: string;
}
