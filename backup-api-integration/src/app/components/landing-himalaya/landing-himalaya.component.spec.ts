import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingHimalayaComponent } from './landing-himalaya.component';

describe('LandingHimalayaComponent', () => {
  let component: LandingHimalayaComponent;
  let fixture: ComponentFixture<LandingHimalayaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingHimalayaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingHimalayaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
