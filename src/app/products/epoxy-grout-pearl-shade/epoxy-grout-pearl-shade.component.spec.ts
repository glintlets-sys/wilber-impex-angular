import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutPearlShadeComponent } from './epoxy-grout-pearl-shade.component';

describe('EpoxyGroutPearlShadeComponent', () => {
  let component: EpoxyGroutPearlShadeComponent;
  let fixture: ComponentFixture<EpoxyGroutPearlShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutPearlShadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutPearlShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
