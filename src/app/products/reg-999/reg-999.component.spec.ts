import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reg999Component } from './reg-999.component';

describe('Reg999Component', () => {
  let component: Reg999Component;
  let fixture: ComponentFixture<Reg999Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reg999Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reg999Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
