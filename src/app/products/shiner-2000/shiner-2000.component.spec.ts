import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shiner2000Component } from './shiner-2000.component';

describe('Shiner2000Component', () => {
  let component: Shiner2000Component;
  let fixture: ComponentFixture<Shiner2000Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shiner2000Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shiner2000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
