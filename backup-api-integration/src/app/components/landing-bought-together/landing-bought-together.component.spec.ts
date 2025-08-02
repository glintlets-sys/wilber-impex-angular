import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBoughtTogetherComponent } from './landing-bought-together.component';

describe('LandingBoughtTogetherComponent', () => {
  let component: LandingBoughtTogetherComponent;
  let fixture: ComponentFixture<LandingBoughtTogetherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingBoughtTogetherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingBoughtTogetherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
