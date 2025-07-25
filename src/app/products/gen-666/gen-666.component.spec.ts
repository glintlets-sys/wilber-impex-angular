import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gen666Component } from './gen-666.component';

describe('Gen666Component', () => {
  let component: Gen666Component;
  let fixture: ComponentFixture<Gen666Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gen666Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gen666Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
