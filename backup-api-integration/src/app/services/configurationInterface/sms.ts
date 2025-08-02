
export enum SmsProviders {
    MSG91 = "Msg91"
}
export interface Msg91SmsConfiguration {
    sender: string;
    authKey: string;
    apiUrl: string;
    shortUrl: string;
    number: string;
    templateId: string;
}


