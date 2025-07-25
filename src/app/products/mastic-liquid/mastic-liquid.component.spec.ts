import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasticLiquidComponent } from './mastic-liquid.component';

describe('MasticLiquidComponent', () => {
  let component: MasticLiquidComponent;
  let fixture: ComponentFixture<MasticLiquidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasticLiquidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasticLiquidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
