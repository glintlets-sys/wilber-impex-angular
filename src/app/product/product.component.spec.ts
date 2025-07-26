import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: 'test-product' })
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should handle product not found', () => {
    // Simulate product not found
    spyOn(component as any, 'getAllProducts').and.returnValue([]);
    component.loadProduct('non-existent-product');
    
    expect(component.error).toBeTrue();
    expect(component.product).toBeNull();
  });

  it('should navigate to product', () => {
    component.navigateToProduct('test-id');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/product', 'test-id']);
  });

  it('should navigate to category', () => {
    component.navigateToCategory('test-category');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/stone-solution', 'test-category']);
  });

  it('should generate correct star ratings', () => {
    const stars = component.getStars(4.5);
    expect(stars).toEqual([1, 1, 1, 1, 0.5]);
  });
}); 