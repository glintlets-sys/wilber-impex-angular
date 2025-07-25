import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilWaterRepellent320Component } from './oil-water-repellent-320.component';

describe('OilWaterRepellent320Component', () => {
  let component: OilWaterRepellent320Component;
  let fixture: ComponentFixture<OilWaterRepellent320Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OilWaterRepellent320Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OilWaterRepellent320Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
