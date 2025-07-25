import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CementCleaner208Component } from './cement-cleaner-208.component';

describe('CementCleaner208Component', () => {
  let component: CementCleaner208Component;
  let fixture: ComponentFixture<CementCleaner208Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CementCleaner208Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CementCleaner208Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
