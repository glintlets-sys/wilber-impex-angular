import { ComponentFixture, TestBed } from '@angular/core/testing';

import { White120130Component } from './white-120-130.component';

describe('White120130Component', () => {
  let component: White120130Component;
  let fixture: ComponentFixture<White120130Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [White120130Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(White120130Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
