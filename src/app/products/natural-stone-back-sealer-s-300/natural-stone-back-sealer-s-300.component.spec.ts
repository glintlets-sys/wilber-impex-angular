import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalStoneBackSealerS300Component } from './natural-stone-back-sealer-s-300.component';

describe('NaturalStoneBackSealerS300Component', () => {
  let component: NaturalStoneBackSealerS300Component;
  let fixture: ComponentFixture<NaturalStoneBackSealerS300Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturalStoneBackSealerS300Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalStoneBackSealerS300Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
