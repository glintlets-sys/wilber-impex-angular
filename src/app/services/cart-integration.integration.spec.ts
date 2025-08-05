import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { CartIntegrationService } from './cart-integration.service';
import { CartService } from '../shared-services/cart.service';
import { OfflineCartService } from '../shared-services/offline-cart.service';
import { AuthenticationService } from '../shared-services/authentication.service';
import { ProductIntegrationService } from './product-integration.service';
import { ToasterService } from '../shared-services/toaster.service';

describe('CartIntegrationService Integration Tests', () => {
  let service: CartIntegrationService;
  let cartService: CartService;
  let offlineCartService: OfflineCartService;
  let authService: AuthenticationService;
  let productIntegrationService: ProductIntegrationService;
  let toasterService: ToasterService;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartIntegrationService,
        {
          provide: CartService,
          useValue: {
            getCart: jasmine.createSpy('getCart').and.returnValue(of({ id: 1, userId: 1, items: [] })),
            addToCart: jasmine.createSpy('addToCart').and.returnValue(of(true)),
            removeFromCart: jasmine.createSpy('removeFromCart').and.returnValue(of(true)),
            updateCartItem: jasmine.createSpy('updateCartItem').and.returnValue(of(true))
          }
        },
        {
          provide: OfflineCartService,
          useValue: {
            getOfflineCart: jasmine.createSpy('getOfflineCart').and.returnValue(of({ id: 1, userId: 0, items: [] })),
            getOfflineCartItems: jasmine.createSpy('getOfflineCartItems').and.returnValue([]),
            addToOfflineCart: jasmine.createSpy('addToOfflineCart'),
            deleteFromOfflineCart: jasmine.createSpy('deleteFromOfflineCart'),
            clearOfflineCart: jasmine.createSpy('clearOfflineCart')
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            userDetails: new BehaviorSubject(null),
            isUserLoggedIn: new BehaviorSubject('false'),
            getUserId: jasmine.createSpy('getUserId').and.returnValue(1)
          }
        },
        {
          provide: ProductIntegrationService,
          useValue: {
            getBackendProductForFrontendProduct: jasmine.createSpy('getBackendProductForFrontendProduct').and.returnValue(mockBackendProduct),
            checkStockForBackendProduct: jasmine.createSpy('checkStockForBackendProduct').and.returnValue(of(mockStockInfo))
          }
        },
        {
          provide: ToasterService,
          useValue: {
            showToast: jasmine.createSpy('showToast')
          }
        }
      ]
    });

    service = TestBed.inject(CartIntegrationService);
    cartService = TestBed.inject(CartService);
    offlineCartService = TestBed.inject(OfflineCartService);
    authService = TestBed.inject(AuthenticationService);
    productIntegrationService = TestBed.inject(ProductIntegrationService);
    toasterService = TestBed.inject(ToasterService);
  });

  describe('Offline Cart Flow', () => {
    it('should add item to offline cart when user is not logged in', () => {
      // Ensure user is not logged in
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.addToCart(mockProduct, 2);
      
      expect(offlineCartService.addToOfflineCart).toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith('Item added to offline cart', jasmine.any(String), 2000);
    });

    it('should validate stock before adding to offline cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.addToCart(mockProduct, 2);
      
      expect(productIntegrationService.getBackendProductForFrontendProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(productIntegrationService.checkStockForBackendProduct).toHaveBeenCalledWith(mockBackendProduct);
    });

    it('should not add item when stock is insufficient', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      // Mock insufficient stock
      const lowStockInfo = { ...mockStockInfo, ready: 1, active: 0, locked: 0, addedToCart: 0, quantity: 1 };
      (productIntegrationService.checkStockForBackendProduct as jasmine.Spy).and.returnValue(of(lowStockInfo));
      
      service.addToCart(mockProduct, 5);
      
      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Only 1 items available in stock. Cannot add 5 items to cart.',
        jasmine.any(String),
        4000
      );
    });
  });

  describe('Online Cart Flow', () => {
    it('should add item to online cart when user is logged in', () => {
      // Simulate user login
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      service.addToCart(mockProduct, 2);
      
      expect(cartService.addToCart).toHaveBeenCalledWith(1, jasmine.objectContaining({
        itemId: mockBackendProduct.id,
        name: mockProduct.name,
        quantity: 2
      }));
      expect(toasterService.showToast).toHaveBeenCalledWith('Item added to cart', jasmine.any(String), 2000);
    });

    it('should validate stock before adding to online cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      service.addToCart(mockProduct, 2);
      
      expect(productIntegrationService.getBackendProductForFrontendProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(productIntegrationService.checkStockForBackendProduct).toHaveBeenCalledWith(mockBackendProduct);
    });
  });

  describe('Cart Mode Switching', () => {
    it('should switch to online mode when user logs in', () => {
      expect(service.isOfflineMode()).toBe(true);
      
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      expect(service.isOnlineMode()).toBe(true);
      expect(service.isOfflineMode()).toBe(false);
    });

    it('should switch to offline mode when user logs out', () => {
      // First login
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      expect(service.isOnlineMode()).toBe(true);
      
      // Then logout
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      expect(service.isOfflineMode()).toBe(true);
      expect(service.isOnlineMode()).toBe(false);
    });
  });

  describe('Cart Merging', () => {
    it('should merge offline cart items when user logs in', () => {
      const mockOfflineItems = [
        {
          id: 1,
          itemId: 1,
          name: 'Test Product',
          price: 100,
          tax: 0,
          quantity: 2,
          discount: 0,
          variationId: null
        }
      ];
      
      (offlineCartService.getOfflineCartItems as jasmine.Spy).and.returnValue(mockOfflineItems);
      
      // Simulate user login
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      expect(cartService.addToCart).toHaveBeenCalledWith(1, mockOfflineItems[0]);
      expect(offlineCartService.clearOfflineCart).toHaveBeenCalled();
    });

    it('should not merge if no offline items exist', () => {
      (offlineCartService.getOfflineCartItems as jasmine.Spy).and.returnValue([]);
      
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(offlineCartService.clearOfflineCart).not.toHaveBeenCalled();
    });
  });

  describe('Cart Operations', () => {
    it('should remove item from offline cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.removeFromCart(0);
      
      expect(offlineCartService.deleteFromOfflineCart).toHaveBeenCalled();
    });

    it('should remove item from online cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      service.removeFromCart(0);
      
      expect(cartService.getCart).toHaveBeenCalled();
    });

    it('should update quantity in offline cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.updateQuantity(0, 5);
      
      expect(offlineCartService.deleteFromOfflineCart).toHaveBeenCalled();
      expect(offlineCartService.addToOfflineCart).toHaveBeenCalled();
    });

    it('should update quantity in online cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      service.updateQuantity(0, 5);
      
      expect(cartService.getCart).toHaveBeenCalled();
    });

    it('should clear offline cart', () => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.clearCart();
      
      expect(offlineCartService.clearOfflineCart).toHaveBeenCalled();
    });
  });

  describe('Cart Data Retrieval', () => {
    it('should return offline cart data when in offline mode', (done) => {
      (authService.userDetails as BehaviorSubject<any>).next(null);
      
      service.getCart().subscribe(cart => {
        expect(cart.items).toBeDefined();
        expect(cart.totalItems).toBeDefined();
        expect(cart.totalPrice).toBeDefined();
        done();
      });
    });

    it('should return online cart data when in online mode', (done) => {
      (authService.userDetails as BehaviorSubject<any>).next({ userId: 1, name: 'Test User' });
      
      service.getCart().subscribe(cart => {
        expect(cart.items).toBeDefined();
        expect(cart.totalItems).toBeDefined();
        expect(cart.totalPrice).toBeDefined();
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle product not found gracefully', () => {
      (productIntegrationService.getBackendProductForFrontendProduct as jasmine.Spy).and.returnValue(undefined);
      
      service.addToCart(mockProduct, 2);
      
      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Product is not available for purchase at the moment',
        jasmine.any(String),
        3000
      );
    });

    it('should handle stock check errors gracefully', () => {
      (productIntegrationService.checkStockForBackendProduct as jasmine.Spy).and.returnValue(
        new BehaviorSubject(null).asObservable()
      );
      
      service.addToCart(mockProduct, 2);
      
      expect(offlineCartService.addToOfflineCart).not.toHaveBeenCalled();
      expect(cartService.addToCart).not.toHaveBeenCalled();
      expect(toasterService.showToast).toHaveBeenCalledWith(
        'Product is out of stock',
        jasmine.any(String),
        3000
      );
    });
  });
}); 