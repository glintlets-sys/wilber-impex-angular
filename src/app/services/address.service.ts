import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Address {
  id: string;
  label: string; // 'home', 'office', 'other'
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAddressRequest {
  label: string;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  public addresses$ = this.addressesSubject.asObservable();

  private selectedAddressSubject = new BehaviorSubject<Address | null>(null);
  public selectedAddress$ = this.selectedAddressSubject.asObservable();

  constructor() {
    this.loadAddressesFromStorage();
  }

  // Get all addresses for current user
  getAddresses(): Observable<Address[]> {
    return this.addresses$;
  }

  // Get current addresses value
  getCurrentAddresses(): Address[] {
    return this.addressesSubject.value;
  }

  // Get selected address
  getSelectedAddress(): Address | null {
    return this.selectedAddressSubject.value;
  }

  // Set selected address
  setSelectedAddress(address: Address | null): void {
    this.selectedAddressSubject.next(address);
    if (address) {
      localStorage.setItem('selectedAddress', JSON.stringify(address));
    } else {
      localStorage.removeItem('selectedAddress');
    }
  }

  // Add new address
  addAddress(request: CreateAddressRequest): Observable<{ success: boolean; address?: Address; message: string }> {
    const newAddress: Address = {
      id: 'addr_' + Date.now(),
      ...request,
      userId: 'current_user', // In real app, get from auth service
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentAddresses = this.addressesSubject.value;

    // If this is set as default, remove default from other addresses
    if (request.isDefault) {
      currentAddresses.forEach(addr => addr.isDefault = false);
    }

    // Add new address
    currentAddresses.push(newAddress);

    // Update addresses
    this.addressesSubject.next([...currentAddresses]);
    this.saveAddressesToStorage();

    return of({
      success: true,
      address: newAddress,
      message: 'Address added successfully'
    }).pipe(delay(800));
  }

  // Update address
  updateAddress(request: UpdateAddressRequest): Observable<{ success: boolean; address?: Address; message: string }> {
    const currentAddresses = this.addressesSubject.value;
    const addressIndex = currentAddresses.findIndex(addr => addr.id === request.id);

    if (addressIndex === -1) {
      return of({
        success: false,
        message: 'Address not found'
      }).pipe(delay(800));
    }

    // If this is set as default, remove default from other addresses
    if (request.isDefault) {
      currentAddresses.forEach(addr => {
        if (addr.id !== request.id) {
          addr.isDefault = false;
        }
      });
    }

    // Update address
    const updatedAddress: Address = {
      ...currentAddresses[addressIndex],
      ...request,
      updatedAt: new Date()
    };

    currentAddresses[addressIndex] = updatedAddress;
    this.addressesSubject.next([...currentAddresses]);
    this.saveAddressesToStorage();

    return of({
      success: true,
      address: updatedAddress,
      message: 'Address updated successfully'
    }).pipe(delay(800));
  }

  // Delete address
  deleteAddress(addressId: string): Observable<{ success: boolean; message: string }> {
    const currentAddresses = this.addressesSubject.value;
    const addressToDelete = currentAddresses.find(addr => addr.id === addressId);

    if (!addressToDelete) {
      return of({
        success: false,
        message: 'Address not found'
      }).pipe(delay(800));
    }

    // Remove address
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);
    this.addressesSubject.next(updatedAddresses);
    this.saveAddressesToStorage();

    // If deleted address was selected, clear selection
    if (this.selectedAddressSubject.value?.id === addressId) {
      this.setSelectedAddress(null);
    }

    return of({
      success: true,
      message: 'Address deleted successfully'
    }).pipe(delay(800));
  }

  // Set address as default
  setDefaultAddress(addressId: string): Observable<{ success: boolean; message: string }> {
    const currentAddresses = this.addressesSubject.value;
    const addressIndex = currentAddresses.findIndex(addr => addr.id === addressId);

    if (addressIndex === -1) {
      return of({
        success: false,
        message: 'Address not found'
      }).pipe(delay(800));
    }

    // Remove default from all addresses
    currentAddresses.forEach(addr => addr.isDefault = false);

    // Set new default
    currentAddresses[addressIndex].isDefault = true;
    currentAddresses[addressIndex].updatedAt = new Date();

    this.addressesSubject.next([...currentAddresses]);
    this.saveAddressesToStorage();

    return of({
      success: true,
      message: 'Default address updated successfully'
    }).pipe(delay(800));
  }

  // Load addresses from storage
  private loadAddressesFromStorage(): void {
    const addressesStr = localStorage.getItem('userAddresses');
    const selectedAddressStr = localStorage.getItem('selectedAddress');

    if (addressesStr) {
      try {
        const addresses = JSON.parse(addressesStr);
        this.addressesSubject.next(addresses);
      } catch (error) {
        console.error('Error loading addresses from storage:', error);
        this.addressesSubject.next([]);
      }
    }

    if (selectedAddressStr) {
      try {
        const selectedAddress = JSON.parse(selectedAddressStr);
        this.selectedAddressSubject.next(selectedAddress);
      } catch (error) {
        console.error('Error loading selected address from storage:', error);
        this.selectedAddressSubject.next(null);
      }
    }
  }

  // Save addresses to storage
  private saveAddressesToStorage(): void {
    localStorage.setItem('userAddresses', JSON.stringify(this.addressesSubject.value));
  }

  // Clear all addresses (for logout)
  clearAddresses(): void {
    this.addressesSubject.next([]);
    this.selectedAddressSubject.next(null);
    localStorage.removeItem('userAddresses');
    localStorage.removeItem('selectedAddress');
  }

  // Get default address
  getDefaultAddress(): Address | null {
    const addresses = this.addressesSubject.value;
    return addresses.find(addr => addr.isDefault) || null;
  }

  // Validate address
  validateAddress(address: CreateAddressRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.fullName?.trim()) {
      errors.push('Full name is required');
    }

    if (!address.addressLine1?.trim()) {
      errors.push('Address line 1 is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State is required');
    }

    if (!address.pincode?.trim()) {
      errors.push('Pincode is required');
    } else if (!/^\d{6}$/.test(address.pincode.trim())) {
      errors.push('Pincode must be 6 digits');
    }

    if (address.mobile && !/^\d{10}$/.test(address.mobile.trim())) {
      errors.push('Mobile number must be 10 digits');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 