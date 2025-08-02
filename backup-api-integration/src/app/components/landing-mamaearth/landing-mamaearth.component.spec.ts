import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingMamaearthComponent } from './landing-mamaearth.component';

describe('LandingMamaearthComponent', () => {
  let component: LandingMamaearthComponent;
  let fixture: ComponentFixture<LandingMamaearthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingMamaearthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingMamaearthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
