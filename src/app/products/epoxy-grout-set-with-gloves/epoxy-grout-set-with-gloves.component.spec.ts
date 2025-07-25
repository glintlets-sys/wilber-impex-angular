import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutSetWithGlovesComponent } from './epoxy-grout-set-with-gloves.component';

describe('EpoxyGroutSetWithGlovesComponent', () => {
  let component: EpoxyGroutSetWithGlovesComponent;
  let fixture: ComponentFixture<EpoxyGroutSetWithGlovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutSetWithGlovesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutSetWithGlovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
