import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { CartIntegrationService, LocalCart, LocalCartItem } from '../services/cart-integration.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { AddressService, Address } from '../shared-services/address.service';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let cartIntegrationService: jasmine.SpyObj<CartIntegrationService>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let addressService: jasmine.SpyObj<AddressService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    userId: 1,
    name: 'Test User',
    email: 'test@example.com'
  } as any;

  const mockAddress: Address = {
    id: 1,
    userId: 1,
    firstLine: '123 Test Street',
    secondLine: 'Apt 4B',
    city: 'Test City',
    state: 'Test State',
    country: 'Test Country',
    pincode: '12345',
    mobileNumber: '1234567890',
    alternateNumber: '',
    emailAddress: 'test@example.com',
    isDefault: true
  };

  const mockCartItem: LocalCartItem = {
    product: {
      id: 'test-product-1',
      name: 'Test Product',
      price: '₹100',
      image: 'test-image.jpg'
    },
    quantity: 2,
    size: '',
    color: '',
    packagingType: '',
    selectedPrice: '₹100'
  };

  const mockCart: LocalCart = {
    items: [mockCartItem],
    totalItems: 2,
    totalPrice: 200
  };

  beforeEach(async () => {
    const cartIntegrationServiceSpy = jasmine.createSpyObj('CartIntegrationService', [
      'getCart', 'updateQuantity', 'removeFromCart', 'clearCart'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getUserId']);
    const addressServiceSpy = jasmine.createSpyObj('AddressService', ['getAllAddresses']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Setup default return values
    cartIntegrationServiceSpy.getCart.and.returnValue(of(mockCart));
    authServiceSpy.getUserId.and.returnValue(1);
    addressServiceSpy.getAllAddresses.and.returnValue(of([mockAddress]));

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        { provide: CartIntegrationService, useValue: cartIntegrationServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: AddressService, useValue: addressServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    cartIntegrationService = TestBed.inject(CartIntegrationService) as jasmine.SpyObj<CartIntegrationService>;
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    addressService = TestBed.inject(AddressService) as jasmine.SpyObj<AddressService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with empty cart and user data', () => {
      expect(component.cartItems).toEqual([]);
      expect(component.totalItems).toBe(0);
      expect(component.totalPrice).toBe(0);
      expect(component.currentUser).toBeNull();
      expect(component.addresses).toEqual([]);
      expect(component.selectedAddress).toBeNull();
    });

    it('should subscribe to cart updates', () => {
      component.ngOnInit();
      
      expect(cartIntegrationService.getCart).toHaveBeenCalled();
      expect(component.cartItems).toEqual(mockCart.items);
      expect(component.totalItems).toBe(mockCart.totalItems);
      expect(component.totalPrice).toBe(mockCart.totalPrice);
    });

    it('should subscribe to user details', () => {
      component.ngOnInit();
      
      // Simulate user details update
      (authService.userDetails as BehaviorSubject<any>).next(mockUser);
      
      expect(component.currentUser).toEqual(mockUser);
    });

    it('should load addresses on initialization', () => {
      component.ngOnInit();
      
      expect(addressService.getAllAddresses).toHaveBeenCalled();
      expect(component.addresses).toEqual([mockAddress]);
      expect(component.selectedAddress).toEqual(mockAddress); // Should select default address
    });

    it('should select first address if no default address exists', () => {
      const nonDefaultAddress = { ...mockAddress, isDefault: false };
      addressService.getAllAddresses.and.returnValue(of([nonDefaultAddress]));
      
      component.ngOnInit();
      
      expect(component.selectedAddress).toEqual(nonDefaultAddress);
    });
  });

  describe('User Authentication', () => {
    it('should redirect to login if user is not logged in', () => {
      (authService.isUserLoggedIn as BehaviorSubject<string>).next('false');
      
      component.ngOnInit();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should not redirect if user is logged in', () => {
      (authService.isUserLoggedIn as BehaviorSubject<string>).next('true');
      
      component.ngOnInit();
      
      expect(router.navigate).not.toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Cart Operations', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should update item quantity', () => {
      component.updateQuantity(0, 5);
      
      expect(cartIntegrationService.updateQuantity).toHaveBeenCalledWith(0, 5);
    });

    it('should not update quantity if it is 0 or negative', () => {
      component.updateQuantity(0, 0);
      component.updateQuantity(0, -1);
      
      expect(cartIntegrationService.updateQuantity).not.toHaveBeenCalled();
    });

    it('should remove item from cart', () => {
      component.removeItem(0);
      
      expect(cartIntegrationService.removeFromCart).toHaveBeenCalledWith(0);
    });

    it('should clear cart', () => {
      component.clearCart();
      
      expect(cartIntegrationService.clearCart).toHaveBeenCalled();
    });

    it('should calculate item total correctly', () => {
      const total = component.getItemTotal(mockCartItem);
      
      expect(total).toBe(200); // ₹100 * 2 quantity
    });

    it('should handle price extraction correctly', () => {
      expect(component.extractPrice('₹1,234.56')).toBe(1234.56);
      expect(component.extractPrice('100')).toBe(100);
      expect(component.extractPrice('invalid')).toBe(0);
      expect(component.extractPrice('')).toBe(0);
    });
  });

  describe('Address Management', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should select an address', () => {
      const newAddress = { ...mockAddress, id: 2, name: 'New Address' };
      
      component.selectAddress(newAddress);
      
      expect(component.selectedAddress).toEqual(newAddress);
    });

    it('should navigate to account page', () => {
      component.navigateToAccount();
      
      expect(router.navigate).toHaveBeenCalledWith(['/account']);
    });
  });

  describe('Checkout Flow', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.currentUser = mockUser;
      component.selectedAddress = mockAddress;
    });

    it('should proceed to payment when user and address are available', () => {
      spyOn(console, 'log');
      
      component.proceedToPayment();
      
      expect(console.log).toHaveBeenCalledWith('Proceeding to payment with address:', mockAddress);
    });

    it('should redirect to login if user is not available', () => {
      component.currentUser = null;
      
      component.proceedToPayment();
      
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show alert if no address is selected', () => {
      component.selectedAddress = null;
      spyOn(window, 'alert');
      
      component.proceedToPayment();
      
      expect(window.alert).toHaveBeenCalledWith('Please select a delivery address');
    });
  });

  describe('Cart Data Updates', () => {
    it('should update cart data when cart changes', () => {
      const newCart: LocalCart = {
        items: [
          { ...mockCartItem, quantity: 3 },
          { ...mockCartItem, product: { ...mockCartItem.product, id: 'test-product-2' } }
        ],
        totalItems: 5,
        totalPrice: 500
      };
      
      // Simulate cart update
      cartIntegrationService.getCart.and.returnValue(of(newCart));
      component.ngOnInit();
      
      expect(component.cartItems).toEqual(newCart.items);
      expect(component.totalItems).toBe(newCart.totalItems);
      expect(component.totalPrice).toBe(newCart.totalPrice);
    });

    it('should handle empty cart', () => {
      const emptyCart: LocalCart = {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
      
      cartIntegrationService.getCart.and.returnValue(of(emptyCart));
      component.ngOnInit();
      
      expect(component.cartItems).toEqual([]);
      expect(component.totalItems).toBe(0);
      expect(component.totalPrice).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle address loading errors gracefully', () => {
      addressService.getAllAddresses.and.returnValue(throwError('Network error'));
      
      component.ngOnInit();
      
      expect(component.addresses).toEqual([]);
      expect(component.selectedAddress).toBeNull();
    });

    it('should handle cart loading errors gracefully', () => {
      cartIntegrationService.getCart.and.returnValue(throwError('Cart error'));
      
      component.ngOnInit();
      
      expect(component.cartItems).toEqual([]);
      expect(component.totalItems).toBe(0);
      expect(component.totalPrice).toBe(0);
    });
  });

  describe('Component Lifecycle', () => {
    it('should unsubscribe from subscriptions on destroy', () => {
      spyOn(component['cartSubscription'], 'unsubscribe');
      spyOn(component['userSubscription'], 'unsubscribe');
      
      component.ngOnDestroy();
      
      expect(component['cartSubscription'].unsubscribe).toHaveBeenCalled();
      expect(component['userSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null cart items', () => {
      const cartWithNullItems = { ...mockCart, items: null as any };
      cartIntegrationService.getCart.and.returnValue(of(cartWithNullItems));
      
      component.ngOnInit();
      
      expect(component.cartItems).toEqual([]);
      expect(component.totalItems).toBe(0);
      expect(component.totalPrice).toBe(0);
    });

    it('should handle cart items with missing properties', () => {
      const incompleteCartItem = {
        product: { name: 'Test Product' },
        quantity: 1
      } as LocalCartItem;
      
      const cartWithIncompleteItems = {
        items: [incompleteCartItem],
        totalItems: 1,
        totalPrice: 0
      };
      
      cartIntegrationService.getCart.and.returnValue(of(cartWithIncompleteItems));
      
      component.ngOnInit();
      
      expect(component.cartItems).toEqual([incompleteCartItem]);
      expect(component.totalItems).toBe(1);
      expect(component.totalPrice).toBe(0);
    });

    it('should handle user details with empty string', () => {
      (authService.userDetails as BehaviorSubject<any>).next('');
      
      component.ngOnInit();
      
      expect(component.currentUser).toBeNull();
    });
  });
}); 