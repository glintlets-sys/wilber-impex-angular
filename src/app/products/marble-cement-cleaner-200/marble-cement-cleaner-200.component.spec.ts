import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleCementCleaner200Component } from './marble-cement-cleaner-200.component';

describe('MarbleCementCleaner200Component', () => {
  let component: MarbleCementCleaner200Component;
  let fixture: ComponentFixture<MarbleCementCleaner200Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleCementCleaner200Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleCementCleaner200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
