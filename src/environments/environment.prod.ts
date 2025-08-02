export const environment = {
  production: true,

  //serviceURL: 'http://localhost:5000/', 
  serviceURL: 'https://api.glintcloudshops.com/',
  MERCHANT_ID: '2513554',
  ACCESS_CODE: 'AVUR72KF48AB14RUBA',
  WORKING_KEY: 'F3BFA2BD31149ACBECC23D86107DEEED',
  REDIRECT_URL: 'https://www.api.glintcloudshops.com/api/purchases/payment-response',
  CANCEL_URL: 'https://www.api.glintcloudshops.com/api/purchases/payment-response',
  sender: 'GLNTYS',
  authKey: '395174AM41i5xc64991938P1',
  apiUrl: 'https://control.msg91.com/api/v5/flow/',
  shortUrl: '1',
  number: '5',
  templateId: '66b5e298d6fc0513db1d1b42',

  // Phone pe integration 
  phonePeMerchantId: 'KRISHNONLINE',
  phonePeRedirectUrl: 'https://www.colourcubs.com/myaccount/orderSuccess',
  phonePeRedirectMode: 'REDIRECT',
  phonePeCallbackUrl: 'https://api.glintcloudshops.com/api/phonepe/callback',
  phonePePaymentInstrumentType: 'PAY_PAGE',
  phonepeSaltKey: 'eae2fe40-a801-4e4c-9b8e-aee00723e132',
  phonepeSaltIndex: '2',
  phonepePaymentGateway:'https://api.phonepe.com/apis/hermes',

  // Local storage keys
  USER_DETAILS: 'userDetails',
  AUTH_TOKEN: 'authToken',

  // for pagination
  tableSize: 10
};

/*    
  phonePeMerchantId: 'KRISHNONLINE',
  phonePeRedirectUrl: 'https://www.colourcubs.com/myaccount/orderSuccess',
  phonePeRedirectMode: 'REDIRECT',
  phonePeCallbackUrl: 'https://api.glintcloudshops.com/api/phonepe/callback',
  phonePePaymentInstrumentType: 'PAY_PAGE',
  phonepeSaltKey: 'eae2fe40-a801-4e4c-9b8e-aee00723e132',
  phonepeSaltIndex: '2',
  phonepePaymentGateway:'https://api.phonepe.com/apis/hermes'

  phonePeMerchantId: 'PGTESTPAYUAT',
  phonePeRedirectUrl: 'https://www.colourcubs.com/myorders/phonepe/',
  phonePeRedirectMode: 'REDIRECT',
  phonePeCallbackUrl: 'https://api.glintcloudshops.com/api/phonepe/callback',
  phonePePaymentInstrumentType: 'PAY_PAGE',
  phonepeSaltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  phonepeSaltIndex: '1',
  phonepePaymentGateway:'https://api-preprod.phonepe.com/apis/pg-sandbox'
*/ 