import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarblePolishPowderComponent } from './marble-polish-powder.component';

describe('MarblePolishPowderComponent', () => {
  let component: MarblePolishPowderComponent;
  let fixture: ComponentFixture<MarblePolishPowderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarblePolishPowderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarblePolishPowderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
