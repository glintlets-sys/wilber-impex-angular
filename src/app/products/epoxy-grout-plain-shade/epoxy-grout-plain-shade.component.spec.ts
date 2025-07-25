import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutPlainShadeComponent } from './epoxy-grout-plain-shade.component';

describe('EpoxyGroutPlainShadeComponent', () => {
  let component: EpoxyGroutPlainShadeComponent;
  let fixture: ComponentFixture<EpoxyGroutPlainShadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutPlainShadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutPlainShadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
