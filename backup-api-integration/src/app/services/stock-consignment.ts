export class ConsignmentItem {
    id: number;
    itemId: number;
    purchasePrice: Price;
    margin: Price;
    shippingCost: Price;
    quantity: number;
}


export enum Currency {
    INR = "INR",
    // other currencies...
}

export class Price {
    id: number;
    amount: number;
    currency: Currency;
}

export class Dealer {
    id: number;
    dealerName: string;
    address: Address; // Assuming you have an Address model
}

export class StockConsignment {
    id: number;
    invoiceNumber: number;
    dealer: Dealer;
    purchaseDate: Date;
    consignmentCost: Price;
    consignmentItems: ConsignmentItem[];
    invoiceImage: string; // URL type in Java can be represented as string in TypeScript
    shippingCost: Price;
    stockCreated: boolean;
    stockCreatedOn: Date;
}

export class Address {
    id: number;
    userId: number;
    firstLine: string;
    secondLine: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    mobileNumber: string;
    alternateNumber: string;
    emailAddress: string;
    isDefault: boolean;

    constructor() {
        this.isDefault = false;
    }
}
