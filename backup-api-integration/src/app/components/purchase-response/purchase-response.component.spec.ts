import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseResponseComponent } from './purchase-response.component';

describe('PurchaseResponseComponent', () => {
  let component: PurchaseResponseComponent;
  let fixture: ComponentFixture<PurchaseResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseResponseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
