import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingSkillmaticsComponent } from './landing-skillmatics.component';

describe('LandingSkillmaticsComponent', () => {
  let component: LandingSkillmaticsComponent;
  let fixture: ComponentFixture<LandingSkillmaticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingSkillmaticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingSkillmaticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
