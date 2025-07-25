import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranitoColourEnhancer400Component } from './granito-colour-enhancer-400.component';

describe('GranitoColourEnhancer400Component', () => {
  let component: GranitoColourEnhancer400Component;
  let fixture: ComponentFixture<GranitoColourEnhancer400Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GranitoColourEnhancer400Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GranitoColourEnhancer400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
