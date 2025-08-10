// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //serviceURL: 'http://localhost:5000/',
  serviceURL: 'https://api.glintcloudshops.com/',
  tenant: 'wilber-prod',
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

  // Phone pe integration - Updated to latest working test credentials
  phonePeMerchantId: 'PGTESTPAYUAT86', // Latest working test merchant ID
  phonePeRedirectUrl: 'http://localhost:4200/payment-response',
  phonePeRedirectMode: 'POST',
  phonePeCallbackUrl: 'https://api.glintcloudshops.com/api/phonepe/callback',
  phonePePaymentInstrumentType: 'PAY_PAGE',
  phonepeSaltKey: '96434309-7796-489d-8924-ab56988a6076', // Latest working test salt key
  phonepeSaltIndex: '1', // Test salt index
  phonepePaymentGateway:'https://api-preprod.phonepe.com/apis/pg-sandbox', // Test gateway
  
  // Development flags - PhonePe sandbox is currently broken
  enablePhonePeMockMode: true, // Enable mock mode for development until PhonePe provides working test credentials

  // Local storage keys
  USER_DETAILS: 'userDetails',
  AUTH_TOKEN: 'authToken',

  // for pagination
  tableSize: 10
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI. 