import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockExcelComponent } from './stock-excel.component';

describe('StockExcelComponent', () => {
  let component: StockExcelComponent;
  let fixture: ComponentFixture<StockExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
