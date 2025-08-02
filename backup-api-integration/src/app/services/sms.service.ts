import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SMSService {
  private headers = new HttpHeaders({
    'Accept': 'application/json',
    'authKey': environment.authKey,
    'Content-Type': 'application/json'
  });

  private templateId = environment.templateId;
  private apiUrl = environment.apiUrl;
  private sender = environment.sender;
  private shortUrl = environment.shortUrl;
  private number = environment.number;
  private secretKey = 'YourSecretKey'; // Replace with your desired secret key

  private latestOTPSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public latestOTP$: Observable<string> = this.latestOTPSubject.asObservable();

  private lastSentTimestamps: { [mobileNumber: string]: number } = {};
  private sentCount: { [mobileNumber: string]: number } = {};

  constructor(
    private http: HttpClient,
    private toaster: ToasterService
  ) { }

  sendSMS(mobileNumber: string): Promise<boolean> {
    const currentTime = Date.now();
    if (!this.isEligibleToSendSMS(mobileNumber, currentTime)) {
      if (this.errorMsg !== undefined) {
        this.handleError(this.errorMsg);
        this.errorMsg = undefined;
      } else {
        this.handleError('Cannot send SMS. Please wait before sending another SMS.');
      }

      return Promise.resolve(false);
    }

    return this.checkMobileNumberAvailability(mobileNumber).then((isAvailable) => {
      if (!isAvailable) {
        this.handleError('Mobile number is already registered.');
        return false;
      }
      const otp = this.generateOTP();
      return this.http
        .post<any>(environment.serviceURL + 'authenticate/send-sms', { "mobileNumber": "+91" + mobileNumber, "otp": otp })
        .toPromise()
        .then((response) => {
          if (response.success) {
            this.updateOTPValue(otp);
            this.updateLastSentTimestamp(mobileNumber, currentTime);
            this.incrementSentCount(mobileNumber);
            this.toaster.showToast("OTP has been sent to your Mobile Number", ToastType.Success, 3000);
            return true;
          } else {
            this.handleError('Failed to send SMS');
            return false;
          }
        })
        .catch((error) => {
          this.handleError(error.message || 'An error occurred while sending the SMS.');
          return false;
        });
    });
  }

  public sendCustomerPin(mobileNumber: string): Promise<boolean> {
    console.log("template id: " + environment.templateId)
    return this.http
      .post<any>(environment.serviceURL + 'authenticate/send-pin', { "mobileNumber": + mobileNumber, "templateId": environment.templateId })
      .toPromise()
      .then((response) => {
        if (response.success) {

          this.toaster.showToast("New Pin has been sent to registered mobile number. ", ToastType.Success, 3000);
          return true;
        } else {
          this.handleError('Failed to send pin');
          return false;
        }
      })
      .catch((error) => {
        this.handleError('User may not have registered. Please recheck or contact glintlets@gmail.com ');
        return false;
      });
  }


  private checkMobileNumberAvailability(mobileNumber: string): Promise<boolean> {
    let AUTHENTICATION_SERVICE_URL = environment.serviceURL + 'authenticate/';
    return this.http
      .get<boolean>(`${AUTHENTICATION_SERVICE_URL}verifyRegistration/${mobileNumber}`)
      .toPromise();
  }

  private updateOTPValue(otp: string): void {
    this.latestOTPSubject.next(otp);
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private handleError(errorMessage: string): void {
    console.error(errorMessage);
    this.toaster.showToast(errorMessage, ToastType.Error, 3000);
  }

  private errorMsg: string;

  private isEligibleToSendSMS(mobileNumber: string, currentTime: number): boolean {
    const encryptedTimestamp = localStorage.getItem(`sms_lastSent_${mobileNumber}`);
    const encryptedCount = localStorage.getItem(`sms_sentCount_${mobileNumber}`);

    if (encryptedTimestamp && encryptedCount) {
      const lastSentTimestamp = parseInt(AES.decrypt(encryptedTimestamp, this.secretKey).toString(enc.Utf8));
      const sentCount = parseInt(AES.decrypt(encryptedCount, this.secretKey).toString(enc.Utf8));

      if (lastSentTimestamp && currentTime - lastSentTimestamp < 30000) {
        this.errorMsg = 'Less than 30 seconds since the last SMS was sent';
        return false; // Less than 30 seconds since the last SMS sent
      }

      if (sentCount && sentCount >= 3) {
        this.errorMsg = 'Maximum SMS limit reached for the day';
        return false; // Maximum SMS limit reached for the day
      }
    }

    return true;
  }

  private updateLastSentTimestamp(mobileNumber: string, timestamp: number): void {
    const encryptedData = AES.encrypt(timestamp.toString(), this.secretKey).toString();
    localStorage.setItem(`sms_lastSent_${mobileNumber}`, encryptedData);
  }

  private incrementSentCount(mobileNumber: string): void {
    const currentCount = this.sentCount[mobileNumber] || 0;
    const encryptedData = AES.encrypt((currentCount + 1).toString(), this.secretKey).toString();
    localStorage.setItem(`sms_sentCount_${mobileNumber}`, encryptedData);
  }

  public countdownSource = new BehaviorSubject<number>(0);
  public countdown$ = this.countdownSource.asObservable();

  private countdownInterval: any; // Store the interval reference

  startCountdown(seconds: number): void {
    this.countdownSource.next(seconds);

    this.countdownInterval = setInterval(() => {
      const currentCountdown = this.countdownSource.value;
      if (currentCountdown === 0) {
        clearInterval(this.countdownInterval);
      } else {
        this.countdownSource.next(currentCountdown - 1);
      }
    }, 1000);
  }

  stopCountdown(): void {
    clearInterval(this.countdownInterval); 
    this.countdownSource.next(0);
  }

}
