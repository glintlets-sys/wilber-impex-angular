export enum ShippingProviders {
    ShipRocket = "Ship Rocket",
}

export interface ShippingSettings {
    apiUserName: string;
    password: string;
    channelId: string;
    pickupLocation: string;
    authenticationid: string; // disabled
    lastAuthenticatedon: Date; // disabled
}

/**
 * SHIP ROCKET SPECIFIC INTERFACES
 */

export interface SR_CustomOrderRequest {

    // ORDER DETAILS
    order_id: string; //Required
    order_date: string ; //Required
    comment?: string;   //optional
    order_items: Order_Item[]; // Required
       
    //PAYMENT DETAILS
    payment_method: string; // Required ( COD | Prepaid)
    shipping_charges?: number; // optional 
    giftwrap_charges?: number; // optional 
    transaction_charges?: number; //optional
    total_discount?: number; //optional
    sub_total: number; //Required. Total after all discounts.

    // SELLER AND PICKUP DETAILS 
    pickup_location : string ; //Required
    channel_id?: string;   //optional
    reseller_name?: string; //optional: if the name of the reseller 
    company_name?: string; // company name
    
    // BILLING & SHIPPING ADDRESS DETAILS
    billing_customer_name: string; // Required
    billing_last_name?: string; //optional
    billing_address?: string; //optional
    billing_address_2?: string; //optional 
    billing_city: string; // Required. Max 30 characters only. 
    billing_pincode: number; //Required
    billing_state: string; //Required
    billing_country: string; // Required
    billing_isd_code?: string; //optional
    billing_email: string; //Required
    billing_phone: number; //Required
    billing_alternate_phone?: number; //Optional

    shipping_is_billing: boolean; // Required.
    shipping_customer_name?: string; // Required conditional
    shipping_last_name?: string; // optional 
    shipping_address?: string; //Required Conditional 
    shipping_address_2?: string; //optional 
    shipping_city?: string; //Required Conditional
    shipping_pincode?: number; // Required Conditional 
    shipping_country?: string; // Required Conditional
    shipping_state?: string; //Required Conditional 
    shipping_email?: string; // optional 
    shipping_phone?: number; // required conditional 

    longitude?: number; // optional 
    latitude?: number; // optional 

    // PACKAGE SIZE Details 
    length: number; // Required in cms should be more than 0.5 
    breadth: number; // Required in cms should b emore than 0.5 
    height: number; //Required in cms should be more than 0.5 
    weight: number; //Required, in kgs. shoudl be more than 0. 

    // OTHER DETAILS 
    ewaybill_no?: string; //optional
    customer_gstin?: string //optional
    invoice_number?: string; //optional
    order_type?: string; //optional ( ESSENTIALS | NON ESSENTIALS)
    checkout_shipping_method?: string; //optional only for SRF users
    what3words_address?: string; // geocode system code. 
}

export interface Order_Item  {
    name: string;
    sku: string;
    units: number;
    selling_price: string; // selling price inclusive of tax 
    discount?: string; // total discount amount in rupees ( inclusive of tax)
    tax?: number; // tax percent on the item. 
    hsn?: number;
}


export interface SR_CustomOrderResponse {
    order_id: number;
    shipment_id: number;
    status: string,
    status_code: number;
    onboarding_completed_now: number;
    awb_code: string;
    courier_company_id: string;
    courier_name: string;
}
