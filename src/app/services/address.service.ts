import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = environment.serviceURL; // Replace with your actual API URL
  private userId: number;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] AddressService initialized with userId:', this.userId);
  }
  addAddress(address: Address): Observable<Address> {
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] Adding address for userId:', this.userId);
    return this.http.post<Address>(`${this.apiUrl}users/${this.userId}/address`, address);
  }

  updateAddress(address: Address): Observable<Address> {
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] Updating address for userId:', this.userId);
    return this.http.put<Address>(`${this.apiUrl}users/${this.userId}/address/${address.id}`, address);
  }

  deleteAddress(address: Address): Observable<void> {
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] Deleting address for userId:', this.userId);
    return this.http.delete<void>(`${this.apiUrl}users/${this.userId}/address/${address.id}`);
  }

  getDefaultAddress(): Observable<Address | undefined> {
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] Getting default address for userId:', this.userId);
    return this.http.get<Address>(`${this.apiUrl}users/${this.userId}/address/default`);
  }

  getAllAddresses(): Observable<Address[]> {
    // Refresh userId in case it wasn't available during service initialization
    this.userId = this.authService.getUserId();
    console.log('🔍 [ADDRESS] Getting all addresses for userId:', this.userId);
    console.log('🔍 [ADDRESS] API URL:', `${this.apiUrl}users/${this.userId}/address`);
    
    if (!this.userId) {
      console.error('❌ [ADDRESS] No userId available for address API call');
      console.error('❌ [ADDRESS] This might be because user is not logged in or user details are not stored properly');
      console.error('❌ [ADDRESS] Please ensure user is logged in and user details are properly stored');
      throw new Error('User ID not available. Please login again.');
    }
    
    return this.http.get<Address[]>(`${this.apiUrl}users/${this.userId}/address`);
  }

  makeDefaultAddress(address: Address): Observable<Address> {
    const url = `${this.apiUrl}users/${this.userId}/address/markDefault/${address.id}`;
    return this.http.put<Address>(url, address);
  }
  
}

export interface Address {
  isSelected?: boolean;
  id: number;
  userId: number;
  firstLine: string;
  secondLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mobileNumber: string;
  alternateNumber: string;
  emailAddress: string;
  isDefault: boolean;
} 