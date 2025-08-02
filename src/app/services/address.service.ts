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
  }
  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}users/${this.userId}/address`, address);
  }

  updateAddress(address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}users/${this.userId}/address/${address.id}`, address);
  }

  deleteAddress(address: Address): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}users/${this.userId}/address/${address.id}`);
  }

  getDefaultAddress(): Observable<Address | undefined> {
    return this.http.get<Address>(`${this.apiUrl}users/${this.userId}/address/default`);
  }

  getAllAddresses(): Observable<Address[]> {
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