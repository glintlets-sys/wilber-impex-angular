import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToasterService } from './toaster.service';
import { ToastType } from './toaster';
// import { AES, enc } from 'crypto-js';

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

  private latestOTPSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public latestOTP$: Observable<string | null> = this.latestOTPSubject.asObservable();

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

    // For existing users, send OTP using the correct API (like backup)
    console.log('📱 [SMS] Sending OTP to mobile:', mobileNumber);
    console.log('📱 [SMS] API URL:', environment.serviceURL + 'authenticate/send-pin');
    
    return this.http
      .post<any>(environment.serviceURL + 'authenticate/send-pin', { "mobileNumber": + mobileNumber, "templateId": environment.templateId })
      .toPromise()
      .then((response) => {
        console.log('📱 [SMS] API Response:', response);
        if (response.success) {
          // Use the OTP from backend response if available, otherwise generate local OTP
          const otp = response.otp || this.generateOTP();
          this.updateOTPValue(otp);
          this.updateLastSentTimestamp(mobileNumber, currentTime);
          this.incrementSentCount(mobileNumber);
          this.toaster.showToast("OTP has been sent to your Mobile Number", ToastType.Success, 3000);
          return true;
        } else {
          console.log('📱 [SMS] API returned success: false');
          this.handleError('Failed to send SMS');
          return false;
        }
      })
      .catch((error) => {
        console.error('📱 [SMS] API Error:', error);
        this.handleError(error.message || 'An error occurred while sending the SMS.');
        return false;
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
      .toPromise()
      .then((response) => response || false);
  }

  private updateOTPValue(otp: string): void {
    this.latestOTPSubject.next(otp);
  }

  private generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private handleError(errorMessage: string): void {
    console.error(errorMessage);
    this.toaster.showToast(errorMessage, ToastType.Error, 3000);
  }

  private errorMsg: string | undefined;

  private isEligibleToSendSMS(mobileNumber: string, currentTime: number): boolean {
    const lastSentTimestamp = this.lastSentTimestamps[mobileNumber] || 0;
    const sentCount = this.sentCount[mobileNumber] || 0;

    if (lastSentTimestamp && currentTime - lastSentTimestamp < 30000) {
      this.errorMsg = 'Less than 30 seconds since the last SMS was sent';
      return false; // Less than 30 seconds since the last SMS sent
    }

    if (sentCount >= 3) {
      this.errorMsg = 'Maximum SMS limit reached for the day';
      return false; // Maximum SMS limit reached for the day
    }

    return true;
  }

  private updateLastSentTimestamp(mobileNumber: string, timestamp: number): void {
    this.lastSentTimestamps[mobileNumber] = timestamp;
  }

  private incrementSentCount(mobileNumber: string): void {
    this.sentCount[mobileNumber] = (this.sentCount[mobileNumber] || 0) + 1;
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