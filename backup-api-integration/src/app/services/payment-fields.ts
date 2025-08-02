export interface PaymentFields {
  merchantId: string;
  orderId: string;
  currency: string;
  amount: string;
  redirectUrl: string;
  cancelUrl: string;
  language: string;
  billingName?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  billingTel?: string;
  billingEmail?: string;
  deliveryName?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;
  deliveryCountry?: string;
  deliveryTel?: string;
  merchantParam1?: string;
  merchantParam2?: string;
  merchantParam3?: string;
  merchantParam4?: string;
  merchantParam5?: string;
  promoCode?: string;
  tid?: string;
}


export interface PhonePePaymentFields {
  merchantId: string;
  merchantTransactionId: string,
  amount: number,
  merchantUserId: string,
  redirectUrl: string,
  redirectMode: string,
  callbackUrl: string,
  paymentInstrument: {
    type: string,
    order_id: string,
    tenant_id: string
  },
  mobileNumber: string
}



export interface PhonePeBackendPaymentFields {
  orderId: string,
  amount: number,
  payload: string,
  xVerify: string,
  paymentGatewayUrl: string,
  saltKey: string, 
  saltIndex: string

}