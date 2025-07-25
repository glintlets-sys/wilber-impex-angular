import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutSetWithoutGlovesComponent } from './epoxy-grout-set-without-gloves.component';

describe('EpoxyGroutSetWithoutGlovesComponent', () => {
  let component: EpoxyGroutSetWithoutGlovesComponent;
  let fixture: ComponentFixture<EpoxyGroutSetWithoutGlovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutSetWithoutGlovesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutSetWithoutGlovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
