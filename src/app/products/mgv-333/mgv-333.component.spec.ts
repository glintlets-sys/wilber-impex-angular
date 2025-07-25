import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mgv333Component } from './mgv-333.component';

describe('Mgv333Component', () => {
  let component: Mgv333Component;
  let fixture: ComponentFixture<Mgv333Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mgv333Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mgv333Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
