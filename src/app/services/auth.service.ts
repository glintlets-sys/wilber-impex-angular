import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AddressService, Address } from './address.service';

export interface User {
  id: string;
  mobile: string;
  firstName: string;
  lastName: string;
  email?: string;
  isNewUser: boolean;
  createdAt: Date;
}

export interface LoginRequest {
  mobile: string;
}

export interface VerifyOTPRequest {
  mobile: string;
  otp: string;
}

export interface RegisterRequest {
  mobile: string;
  firstName: string;
  lastName: string;
  email?: string;
}



export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  invoiceUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  packagingType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private injector: Injector) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.clearUser();
      }
    }
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Stub API: Send OTP
  sendOTP(request: LoginRequest): Observable<{ success: boolean; message: string }> {
    console.log('Sending OTP to:', request.mobile);
    
    // Simulate API call delay
    return of({ success: true, message: 'OTP sent successfully' }).pipe(delay(1000));
  }

  // Stub API: Verify OTP
  verifyOTP(request: VerifyOTPRequest): Observable<{ success: boolean; user?: User; message: string }> {
    console.log('Verifying OTP for:', request.mobile, 'OTP:', request.otp);
    
    // For testing purposes, accept any OTP or specifically '123456'
    const isValidOTP = request.otp === '123456' || request.otp.length === 6;
    
    if (!isValidOTP) {
      return of({ 
        success: false, 
        message: 'Invalid OTP. Please enter a valid 6-digit OTP.'
      }).pipe(delay(1000));
    }
    
    // Simulate API call delay
    return of({ 
      success: true, 
      user: {
        id: 'user_' + Date.now(),
        mobile: request.mobile,
        firstName: '',
        lastName: '',
        isNewUser: true,
        createdAt: new Date()
      },
      message: 'OTP verified successfully'
    }).pipe(delay(1500));
  }

  // Stub API: Register new user
  register(request: RegisterRequest): Observable<{ success: boolean; user?: User; message: string }> {
    console.log('Registering user:', request);
    
    const user: User = {
      id: 'user_' + Date.now(),
      mobile: request.mobile,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      isNewUser: false,
      createdAt: new Date()
    };

    // Simulate API call delay
    return of({ 
      success: true, 
      user: user,
      message: 'Registration successful'
    }).pipe(delay(1000));
  }



  // Stub API: Get user orders
  getUserOrders(): Observable<Order[]> {
    const orders: Order[] = [
      {
        id: 'order_1',
        orderNumber: 'ORD-2024-001',
        orderDate: new Date('2024-01-15'),
        status: 'delivered',
        totalAmount: 2500.00,
        items: [
          {
            productId: 'prod_1',
            productName: 'Cement Cleaner',
            quantity: 2,
            price: 1250.00,
            size: '1kg',
            packagingType: 'Polythene Bag'
          }
        ],
        shippingAddress: {
          id: 'addr_1',
          label: 'home',
          fullName: 'John Doe',
          mobile: '9876543210',
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
          userId: 'user_1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        invoiceUrl: '/invoices/ORD-2024-001.pdf'
      },
      {
        id: 'order_2',
        orderNumber: 'ORD-2024-002',
        orderDate: new Date('2024-01-20'),
        status: 'shipped',
        totalAmount: 1800.00,
        items: [
          {
            productId: 'prod_2',
            productName: 'Epoxy Adhesive',
            quantity: 1,
            price: 1800.00,
            size: '2kg',
            packagingType: 'Polythene Bag'
          }
        ],
        shippingAddress: {
          id: 'addr_2',
          label: 'office',
          fullName: 'John Doe',
          mobile: '9876543210',
          addressLine1: '456 Business Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002',
          isDefault: false,
          userId: 'user_1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ];

    return of(orders).pipe(delay(800));
  }

  // Stub API: Download invoice
  downloadInvoice(orderId: string): Observable<{ success: boolean; url?: string; message: string }> {
    console.log('Downloading invoice for order:', orderId);
    
    return of({ 
      success: true, 
      url: `/invoices/ORD-${orderId}.pdf`,
      message: 'Invoice download started'
    }).pipe(delay(500));
  }

  // Stub API: Merge cart with backend
  mergeCart(cartItems: any[]): Observable<{ success: boolean; message: string }> {
    console.log('Merging cart with backend:', cartItems);
    
    return of({ 
      success: true, 
      message: 'Cart merged successfully'
    }).pipe(delay(1000));
  }

  login(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.saveUserToStorage(user);
  }

  logout(): void {
    this.clearUser();
    // Clear addresses on logout
    const addressService = this.injector.get(AddressService);
    addressService.clearAddresses();
  }
} 