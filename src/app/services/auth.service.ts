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
export class AuthService {
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
    console.log('🔍 [AUTH] Authentication response received:', data);
    if (data && data.authStatus === 'SUCCESS') {
      console.log('✅ [AUTH] Authentication successful, updating user state');
      this.updateUserLoggedIn(true);
      const userDetails = this.getUserDetailsFromAPI(data);
      console.log('✅ [AUTH] User details from API:', userDetails);
      this.updateUserDetails(userDetails);
      this.updateUserDetailsInLocalStorage(userDetails);
      this.successSubject.next('true'); // Update success BehaviorSubject
    } else {
      console.log('❌ [AUTH] Authentication failed');
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

  public verifyOTP(mobileNumber: string, otp: string): Observable<any> {
    return this.http.post<any>(AUTHENTICATION_SERVICE_URL + 'verify-otp', { 
      username: mobileNumber, 
      password: otp 
    });
  }

  public logoutUser() {
    console.log('🔍 [AUTH] Logout initiated');
    this.updateUserLoggedIn(false);
    this.updateUserDetails('');
    this.deleteuserDetailInLocalStorate();
    this.cleanCartInLocalStorage();
    
    // Clear any other user-related localStorage items
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedAddress');
    localStorage.removeItem('userAddresses');
    localStorage.removeItem('userName');
    
    // Log all remaining localStorage keys for debugging
    console.log('🔍 [AUTH] Remaining localStorage keys after logout:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`  - ${key}: ${localStorage.getItem(key)}`);
      }
    }
    
    console.log('✅ [AUTH] Logout completed - all user data cleared from localStorage');
  }

  private updateUserLoggedIn(status: boolean) {
    this.isUserLoggedInBehavior.next(status.toString());
  }

  public updateUserDetails(userDetails: any) {
    console.log('🔍 [AUTH] Updating user details:', userDetails);
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
    console.log('🔍 [AUTH] Initializing user login from localStorage');
    const userDetails = this.getDataFromLocal(USER_DETAILS);
    console.log('🔍 [AUTH] User details from localStorage:', userDetails);

    if (userDetails && userDetails !== '') {
      try {
        const parsedUserDetails = JSON.parse(userDetails);
        console.log('✅ [AUTH] Parsed user details:', parsedUserDetails);
        this.updateUserLoggedIn(true);
        this.updateUserDetails(parsedUserDetails);
      } catch (error) {
        console.error('❌ [AUTH] Error parsing user details from localStorage:', error);
        this.updateUserLoggedIn(false);
        this.updateUserDetails('');
      }
    } else {
      console.log('✅ [AUTH] No user details found in localStorage, user not logged in');
      this.updateUserLoggedIn(false);
      this.updateUserDetails('');
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
    const userDetailsStr = localStorage.getItem(USER_DETAILS);
    if (!userDetailsStr) return null;
    const userDetails = JSON.parse(userDetailsStr);
    return userDetails ? userDetails.userId : null;
  }

  public getUsername() {
    const userDetailsStr = localStorage.getItem(USER_DETAILS);
    if (!userDetailsStr) return null;
    const userDetails = JSON.parse(userDetailsStr);
    return userDetails ? userDetails.username : null;
  }

  public isUserAdmin() {
    const role = this.getUserRole();
    return role != null && (role === 'SUPER_ADMIN' );
  }

  public getUserRole() {
    const userDetailsStr = localStorage.getItem(USER_DETAILS);
    if (!userDetailsStr) return null;
    const userDetails = JSON.parse(userDetailsStr);
    return userDetails ? userDetails.role : null;
  }

  public getAdminUsers() {
    return this.http.get(AUTHENTICATION_SERVICE_URL + 'adminusers');
  }

  isRegisteredUser(mobileNumber: string): Observable<boolean> {
    const url = `${AUTHENTICATION_SERVICE_URL}verifyRegistration/${mobileNumber}`;
    return this.http.get<boolean>(url);
  }
} 