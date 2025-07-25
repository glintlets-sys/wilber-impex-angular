import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyGroutSetComponent } from './epoxy-grout-set.component';

describe('EpoxyGroutSetComponent', () => {
  let component: EpoxyGroutSetComponent;
  let fixture: ComponentFixture<EpoxyGroutSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyGroutSetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyGroutSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
