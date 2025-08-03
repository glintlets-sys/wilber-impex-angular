// export interface Payment {
//     ccAvenue: CCAvenueSettings
//     phonePay: PhonePeSettings
// }

export enum PaymentProviders {
    CCAvenueSettings = "CCAvenueSettings",
    PhonePeSettings = "PhonePeSettings",
}



export interface CCAvenueSettings {
    merchant_id: string;
    access_code: string;
    working_key: string;
    redirect_url: string;
    cancel_url: string;

}

export interface PhonePeSettings {
    phonePeMerchantId: string;
    phonePeRedirectUrl: string;
    phonePeRedirectMode: string;
    phonePeCallbackUrl: string;
    phonePePaymentInstrumentType: string;
    phonepeSaltKey: string;
    phonepeSaltIndex: string;
    phonepePaymentGateway: string;
}

