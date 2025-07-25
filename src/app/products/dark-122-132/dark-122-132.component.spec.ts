import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dark122132Component } from './dark-122-132.component';

describe('Dark122132Component', () => {
  let component: Dark122132Component;
  let fixture: ComponentFixture<Dark122132Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dark122132Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dark122132Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
