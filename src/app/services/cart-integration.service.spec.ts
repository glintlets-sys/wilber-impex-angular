import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { CartIntegrationService, LocalCart, LocalCartItem } from './cart-integration.service';
import { CartService, Cart, CartItem } from '../shared-services/cart.service';
import { OfflineCartService } from '../shared-services/offline-cart.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { ProductIntegrationService } from './product-integration.service';
import { ToasterService } from '../shared-services/toaster.service';
import { ToastType } from '../shared-services/toaster';

describe('CartIntegrationService', () => {
  let service: CartIntegrationService;
  let cartService: jasmine.SpyObj<CartService>;
  let offlineCartService: jasmine.SpyObj<OfflineCartService>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let productIntegrationService: jasmine.SpyObj<ProductIntegrationService>;
  let toasterService: jasmine.SpyObj<ToasterService>;

  const mockProduct = {
    id: 'test-product-1',
    name: 'Test Product',
    price: '₹100',
    image: 'test-image.jpg'
  };

  const mockBackendProduct = {
    id: 1,
    name: 'Test Product',
    code: 'TEST001'
  };

  const mockStockInfo = {
    name: 'Test Product',
    itemId: 1,
    quantity: 12,
    usnCode: 'TEST001',
    itemCode: 1,
    presentCost: 100,
    locked: 2,
    active: 5,
    ready: 10,
    addedToCart: 1,
    sold: 0,
    brand: 'Test Brand'
  };

  const mockCartItem: CartItem = {
    id: 1,
    itemId: 1,
    name: 'Test Product',
    price: 100,
    tax: 0,
    quantity: 2,
    discount: 0,
    variationId: null
  };

  const mockCart: Cart = {
    id: 1,
    userId: 1,
    items: [mockCartItem]
  };

  const mockLocalCart: LocalCart = {
    items: [{
      product: mockProduct,
      quantity: 2,
      size: '',
      color: '',
      packagingType: '',
      selectedPrice: '₹100'
    }],
    totalItems: 2,
    totalPrice: 200
  };

  beforeEach(() => {
    const cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCart', 'addToCart', 'removeFromCart', 'updateCartItem', 'clearCart'
    ]);
    const offlineCartServiceSpy = jasmine.createSpyObj('OfflineCartService', [
      'getOfflineCart', 'getOfflineCartItems', 'addToOfflineCart', 
      'deleteFromOfflineCart', 'clearOfflineCart'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'getUserId'
    ]);
    const productIntegrationServiceSpy = jasmine.createSpyObj('ProductIntegrationService', [
      'getBackendProductForFrontendProduct', 'checkStockForBackendProduct'
    ]);
    const toasterServiceSpy = jasmine.createSpyObj('ToasterService', ['showToast']);

    // Setup default return values
    cartServiceSpy.getCart.and.returnValue(of(mockCart));
    offlineCartServiceSpy.getOfflineCart.and.returnValue(of(mockCart));
    offlineCartServiceSpy.getOfflineCartItems.and.returnValue([mockCartItem]);
    authServiceSpy.getUserId.and.returnValue(1);
    productIntegrationServiceSpy.getBackendProductForFrontendProduct.and.returnValue(mockBackendProduct);
    productIntegrationServiceSpy.checkStockForBackendProduct.and.returnValue(of(mockStockInfo));
    cartServiceSpy.addToCart.and.returnValue(of(true));
    cartServiceSpy.removeFromCart.and.returnValue(of(true));
    cartServiceSpy.updateCartItem.and.returnValue(of(true));

    TestBed.configureTestingModule({
      providers: [
        CartIntegrationService,
        { provide: CartService, useValue: cartServiceSpy },
        { provide: OfflineCartService, useValue: offlineCartServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: ProductIntegrationService, useValue: productIntegrationServiceSpy },
        { provide: ToasterService, useValue: toasterServiceSpy }
      ]
    });

    service = TestBed.inject(CartIntegrationService);
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    offlineCartService = TestBed.inject(OfflineCartService) as jasmine.SpyObj<OfflineCartService>;
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    productIntegrationService = TestBed.inject(ProductIntegrationService) as jasmine.SpyObj<ProductIntegrationService>;
    toasterService = TestBed.inject(ToasterService) as jasmine.SpyObj<ToasterService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Cart Mode Management', () => {
    it('should initialize in offline mode by default', () => {
      expect(service.isOfflineMode()).toBe(true);
      expect(service.isOnlineMode()).toBe(false);
    });

    it('should switch to online mode when user logs in', () => {
      // Simulate user login
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      expect(service.isOnlineMode()).toBe(true);
      expect(service.isOfflineMode()).toBe(false);
    });

    it('should switch to offline mode when user logs out', () => {
      // First login
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      // Then logout
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      expect(service.isOfflineMode()).toBe(true);
      expect(service.isOnlineMode()).toBe(false);
    });
  });

  describe('Add to Cart - Offline Mode', () => {
    beforeEach(() => {
      // Ensure we're in offline mode
      (authService.userDetails as BehaviorSubject<any>).next(null);
    });

    it('should add item to offline cart when product is available and has stock', () => {
      service.addToCart(mockProduct, 2);

      expect(productIntegrationService.getBackendProductForFrontendProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(productIntegrationService.checkStockForBackendProduct).toHaveBeenCalledWith(mockBackendProduct);
      expect(offlineCartService.addToOfflineCart).toHaveBeenCalledWith(jasmine.objectContaining({
        itemId: mockBackendProduct.id,
        name: mockProduct.name,
        quantity: 2
      }));
      expect(toasterService.showToast).toHaveBeenCalledWith('Item added to offline cart', ToastType.Success, 2000);
    });

    it('should not add item when product is not integrated', () => {
      productIntegrationService.getBackendProductForFrontendProduct.and.returnValue(undefined);

      service.addToCart(mockProduct, 2);

      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Product is not available for purchase at the moment', 
        ToastType.Warn, 
        3000
      );
    });

    it('should not add item when product is out of stock', () => {
      productIntegrationService.checkStockForBackendProduct.and.returnValue(of(null));

      service.addToCart(mockProduct, 2);

      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith('Product is out of stock', ToastType.Warn, 3000);
    });

    it('should not add item when insufficient stock', () => {
      const lowStockInfo = { ...mockStockInfo, ready: 1, active: 0, locked: 0, addedToCart: 0, quantity: 1 };
      productIntegrationService.checkStockForBackendProduct.and.returnValue(of(lowStockInfo));

      service.addToCart(mockProduct, 5);

      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Only 1 items available in stock. Cannot add 5 items to cart.',
        ToastType.Warn,
        4000
      );
    });

    it('should handle stock check errors gracefully', () => {
      productIntegrationService.checkStockForBackendProduct.and.returnValue(throwError('Network error'));

      service.addToCart(mockProduct, 2);

      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Unable to verify product availability. Please try again.',
        ToastType.Error,
        3000
      );
    });
  });

  describe('Add to Cart - Online Mode', () => {
    beforeEach(() => {
      // Ensure we're in online mode
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
    });

    it('should add item to online cart when user is logged in', () => {
      service.addToCart(mockProduct, 2);

      expect(cartService.addToCart).toHaveBeenCalledWith(1, jasmine.objectContaining({
        itemId: mockBackendProduct.id,
        name: mockProduct.name,
        quantity: 2
      }));
      expect(toasterService.showToast).toHaveBeenCalledWith('Item added to cart', ToastType.Success, 2000);
    });

    it('should handle online cart add errors', () => {
      cartService.addToCart.and.returnValue(throwError('API Error'));

      service.addToCart(mockProduct, 2);

      expect(toasterService.showToast).toHaveBeenCalledWith('Failed to add item to cart', ToastType.Error, 3000);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove item from offline cart when in offline mode', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.removeFromCart(0);

      expect(offlineCartService.deleteFromOfflineCart).toHaveBeenCalledWith(mockCartItem.itemId, mockCartItem.variationId || 0);
    });

    it('should remove item from online cart when in online mode', () => {
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      service.removeFromCart(0);

      expect(cartService.getCart).toHaveBeenCalled();
      expect(cartService.removeFromCart).toHaveBeenCalledWith(1, mockCartItem);
    });
  });

  describe('Update Quantity', () => {
    it('should update quantity in offline cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.updateQuantity(0, 5);

      expect(offlineCartService.deleteFromOfflineCart).toHaveBeenCalled();
      expect(offlineCartService.addToOfflineCart).toHaveBeenCalledWith(jasmine.objectContaining({
        quantity: 5
      }));
    });

    it('should remove item when quantity is 0 or negative in offline mode', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.updateQuantity(0, 0);

      expect(offlineCartService.deleteFromOfflineCart).toHaveBeenCalled();
      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
    });

    it('should update quantity in online cart', () => {
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      service.updateQuantity(0, 5);

      expect(cartService.updateCartItem).toHaveBeenCalledWith(1, jasmine.objectContaining({
        quantity: 5
      }));
    });
  });

  describe('Get Cart', () => {
    it('should return offline cart data when in offline mode', (done) => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.getCart().subscribe(cart => {
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].product.name).toBe('Test Product');
        expect(cart.totalItems).toBe(2);
        expect(cart.totalPrice).toBe(200);
        done();
      });
    });

    it('should return online cart data when in online mode', (done) => {
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      service.getCart().subscribe(cart => {
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].product.name).toBe('Test Product');
        expect(cart.totalItems).toBe(2);
        expect(cart.totalPrice).toBe(200);
        done();
      });
    });
  });

  describe('Clear Cart', () => {
    it('should clear offline cart when in offline mode', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.clearCart();

      expect(offlineCartService.clearOfflineCart).toHaveBeenCalled();
    });

    it('should handle online cart clearing when in online mode', () => {
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      service.clearCart();

      expect(authService.getUserId).toHaveBeenCalled();
    });
  });

  describe('Cart Merging', () => {
    it('should merge offline cart items to online cart on login', () => {
      // Setup offline cart items
      const offlineItems = [mockCartItem];
      offlineCartService.getOfflineCartItems.and.returnValue(offlineItems);

      // Simulate user login
      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);

      expect(cartService.addToCart).toHaveBeenCalledWith(1, mockCartItem);
      expect(offlineCartService.clearOfflineCart).toHaveBeenCalled();
    });

    it('should handle stock validation during merge', () => {
      const offlineItems = [mockCartItem];
      offlineCartService.getOfflineCartItems.and.returnValue(offlineItems);
      
      // Mock insufficient stock
      const lowStockInfo = { ...mockStockInfo, ready: 1, active: 0, locked: 0, addedToCart: 0, quantity: 1 };
      productIntegrationService.checkStockForBackendProduct.and.returnValue(of(lowStockInfo));

      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);

      expect(toasterService.showToast).toHaveBeenCalledWith(
        jasmine.stringContaining('is out of stock or insufficient quantity available'),
        ToastType.Warn,
        5000
      );
    });

    it('should handle merge errors gracefully', () => {
      const offlineItems = [mockCartItem];
      offlineCartService.getOfflineCartItems.and.returnValue(offlineItems);
      
      productIntegrationService.checkStockForBackendProduct.and.returnValue(throwError('Network error'));

      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);

      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Error checking item availability. Please try again.',
        ToastType.Error,
        5000
      );
    });
  });

  describe('Utility Methods', () => {
    it('should extract price correctly from string', () => {
      const result = (service as any).extractPrice('₹1,234.56');
      expect(result).toBe(1234.56);
    });

    it('should handle invalid price strings', () => {
      const result = (service as any).extractPrice('invalid');
      expect(result).toBe(0);
    });

    it('should handle empty price strings', () => {
      const result = (service as any).extractPrice('');
      expect(result).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty offline cart during merge', () => {
      offlineCartService.getOfflineCartItems.and.returnValue([]);

      const userDetails = { userId: 1, name: 'Test User' };
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);

      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(offlineCartService.clearOfflineCart).not.toHaveBeenCalled();
    });

    it('should handle null user details', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      expect(service.isOfflineMode()).toBe(true);
    });

    it('should handle user details without userId', () => {
      const userDetails = { name: 'Test User' }; // No userId
      (authService.userDetails as BehaviorSubject<any>).next(userDetails);
      
      expect(service.isOfflineMode()).toBe(true);
    });
  });
}); 