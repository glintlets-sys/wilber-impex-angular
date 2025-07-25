import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyAdhesive152PartBComponent } from './epoxy-adhesive-152-part-b.component';

describe('EpoxyAdhesive152PartBComponent', () => {
  let component: EpoxyAdhesive152PartBComponent;
  let fixture: ComponentFixture<EpoxyAdhesive152PartBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyAdhesive152PartBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyAdhesive152PartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
