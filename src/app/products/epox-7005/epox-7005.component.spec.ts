import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Epox7005Component } from './epox-7005.component';

describe('Epox7005Component', () => {
  let component: Epox7005Component;
  let fixture: ComponentFixture<Epox7005Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Epox7005Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Epox7005Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
