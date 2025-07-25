import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterRepellent310Component } from './water-repellent-310.component';

describe('WaterRepellent310Component', () => {
  let component: WaterRepellent310Component;
  let fixture: ComponentFixture<WaterRepellent310Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterRepellent310Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterRepellent310Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
