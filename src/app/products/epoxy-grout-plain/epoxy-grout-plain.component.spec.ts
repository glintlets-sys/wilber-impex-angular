import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutPlainComponent } from './epoxy-grout-plain.component';

describe('EpoxyGroutPlainComponent', () => {
  let component: EpoxyGroutPlainComponent;
  let fixture: ComponentFixture<EpoxyGroutPlainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutPlainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
