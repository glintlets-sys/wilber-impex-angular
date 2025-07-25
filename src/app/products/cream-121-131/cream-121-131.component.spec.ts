import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cream121131Component } from './cream-121-131.component';

describe('Cream121131Component', () => {
  let component: Cream121131Component;
  let fixture: ComponentFixture<Cream121131Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cream121131Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cream121131Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
