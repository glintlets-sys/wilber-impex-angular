import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsignmentComponent } from './stock-consignment.component';

describe('StockConsignmentComponent', () => {
  let component: StockConsignmentComponent;
  let fixture: ComponentFixture<StockConsignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockConsignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
