import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasticSolidComponent } from './mastic-solid.component';

describe('MasticSolidComponent', () => {
  let component: MasticSolidComponent;
  let fixture: ComponentFixture<MasticSolidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasticSolidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasticSolidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
