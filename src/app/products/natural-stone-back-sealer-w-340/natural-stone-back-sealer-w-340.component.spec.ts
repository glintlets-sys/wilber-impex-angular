import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturalStoneBackSealerW340Component } from './natural-stone-back-sealer-w-340.component';

describe('NaturalStoneBackSealerW340Component', () => {
  let component: NaturalStoneBackSealerW340Component;
  let fixture: ComponentFixture<NaturalStoneBackSealerW340Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaturalStoneBackSealerW340Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturalStoneBackSealerW340Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
