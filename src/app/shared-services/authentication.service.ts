import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

const SERVICE_URL = environment.serviceURL;
const AUTHENTICATION_SERVICE_URL = SERVICE_URL + 'authenticate/';

const USER_DETAILS = 'userDetails';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isUserLoggedInBehavior: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public isUserLoggedIn = this.isUserLoggedInBehavior.asObservable();

  private userDetailsBehavior: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public userDetails = this.userDetailsBehavior.asObservable();

  constructor(private http: HttpClient) {
    this.initializeUserLogin();
  }

  private userLogin(mobileNumber: string, authPin: string) {
    return this.http.post<any>(AUTHENTICATION_SERVICE_URL + 'login', { username: mobileNumber, password: authPin });
  }

  private userRegistration(username: string, mobileNumber: string, authPin: string) {
    return this.http.post<any>(AUTHENTICATION_SERVICE_URL + 'register', { username: mobileNumber, password: authPin, firstName: username });
  }


  private successSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public success$ = this.successSubject.asObservable();

  public authenticateUser(mobileNumber: string, authPin: string) {
    this.userLogin(mobileNumber, authPin).subscribe(
      (data) => {
        this.handleAuthenticationResponse(data);
      },
      (error) => {
        this.handleError(error); // Handle the error
      }
    );
  }

  public registerUser(username: string, mobileNumber: string, authPin: string) {
    return this.userRegistration(username, mobileNumber, authPin);
  }

  private handleAuthenticationResponse(data: any) {
    if (data && data.authStatus === 'SUCCESS') {
      this.updateUserLoggedIn(true);
      const userDetails = this.getUserDetailsFromAPI(data);
      this.updateUserDetails(userDetails);
      this.updateUserDetailsInLocalStorage(userDetails);
      this.successSubject.next('true'); // Update success BehaviorSubject
    } else {
      this.successSubject.next('false');
    }
  }

  public resetSuccessSubject() {
    this.successSubject.next('');
  }

  private handleError(error: any) {
    // Handle the error based on your requirements
    this.successSubject.next(error);
    console.log('An error occurred:', error);
    // Perform any additional error handling tasks
  }
  public requestOTP(mobileNumber: string): any {
    return this.http.post<any>(SERVICE_URL + 'api/otp/generate-otp', { phoneNumber: mobileNumber });
  }


  public logoutUser() {
    this.updateUserLoggedIn(false);
    this.updateUserDetails('');
    //this.updateUserDetailsInLocalStorage('');
    this.deleteuserDetailInLocalStorate();
    this.cleanCartInLocalStorage();
  }



  private updateUserLoggedIn(status: boolean) {
    this.isUserLoggedInBehavior.next(status.toString());
  }

  private updateUserDetails(userDetails: any) {
    this.userDetailsBehavior.next(userDetails);
  }

  private deleteuserDetailInLocalStorate() {
    localStorage.removeItem(USER_DETAILS);
  }

  private updateUserDetailsInLocalStorage(userDetails: any) {
    if (userDetails === '') {
      this.setDataToLocal(USER_DETAILS, '');
    } else {
      this.setDataToLocal(USER_DETAILS, JSON.stringify(userDetails));
    }
  }

  private getUserDetailsFromAPI(data: any) {
    return data;
  }

  private initializeUserLogin() {
    const userDetails = this.getDataFromLocal(USER_DETAILS);

    if (userDetails) {
      this.updateUserLoggedIn(true);
      this.updateUserDetails(JSON.parse(userDetails));
    }
  }

  private getDataFromLocal(dataKey: string) {
    return localStorage.getItem(dataKey);
  }

  private setDataToLocal(dataKey: string, value: any) {
    localStorage.setItem(dataKey, value);
  }

  private cleanCartInLocalStorage() {
    localStorage.removeItem('cart');
  }

  public getUserId() {
    const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS));
    return userDetails ? userDetails.userId : null;
  }

  public getUsername() {
    const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS));
    return userDetails ? userDetails.username : null;
  }

  public isUserAdmin() {
    return this.getUserRole() != null && (this.getUserRole() === 'SUPER_ADMIN' );
  }

  public getUserRole() {
    const userDetails = JSON.parse(localStorage.getItem(USER_DETAILS));
    return userDetails ? userDetails.role : null;
  }

  public getAdminUsers() {
    return this.http.get(AUTHENTICATION_SERVICE_URL + 'adminusers');
  }

  isRegisteredUser(mobileNumber: string): Observable<boolean> {
    const url = `${AUTHENTICATION_SERVICE_URL}verifyRegistration/${mobileNumber}`;
    return this.http.get<boolean>(url);
  }

  // Public method to refresh user data from localStorage
  public refreshUserData(): void {
    this.initializeUserLogin();
  }

}
