import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecommendedModalComponent } from './manage-recommended-modal.component';

describe('ManageRecommendedModalComponent', () => {
  let component: ManageRecommendedModalComponent;
  let fixture: ComponentFixture<ManageRecommendedModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRecommendedModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRecommendedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
