import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecommendationModalComponent } from './manage-recommendation-modal.component';

describe('ManageRecommendationModalComponent', () => {
  let component: ManageRecommendationModalComponent;
  let fixture: ComponentFixture<ManageRecommendationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRecommendationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRecommendationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
