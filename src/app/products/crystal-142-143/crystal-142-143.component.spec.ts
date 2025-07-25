import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crystal142143Component } from './crystal-142-143.component';

describe('Crystal142143Component', () => {
  let component: Crystal142143Component;
  let fixture: ComponentFixture<Crystal142143Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crystal142143Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Crystal142143Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
