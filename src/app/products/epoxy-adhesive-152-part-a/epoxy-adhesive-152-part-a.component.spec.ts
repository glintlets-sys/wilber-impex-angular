import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyAdhesive152PartAComponent } from './epoxy-adhesive-152-part-a.component';

describe('EpoxyAdhesive152PartAComponent', () => {
  let component: EpoxyAdhesive152PartAComponent;
  let fixture: ComponentFixture<EpoxyAdhesive152PartAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyAdhesive152PartAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyAdhesive152PartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
