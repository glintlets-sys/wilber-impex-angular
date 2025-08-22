import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecommendationsComponent } from './admin-recommendations.component';

describe('AdminRecommendationsComponent', () => {
  let component: AdminRecommendationsComponent;
  let fixture: ComponentFixture<AdminRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecommendationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
