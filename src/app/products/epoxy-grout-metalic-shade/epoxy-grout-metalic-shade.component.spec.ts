import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutMetalicShadeComponent } from './epoxy-grout-metalic-shade.component';

describe('EpoxyGroutMetalicShadeComponent', () => {
  let component: EpoxyGroutMetalicShadeComponent;
  let fixture: ComponentFixture<EpoxyGroutMetalicShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutMetalicShadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutMetalicShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
