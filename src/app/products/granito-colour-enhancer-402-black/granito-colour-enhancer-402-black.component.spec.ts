import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranitoColourEnhancer402BlackComponent } from './granito-colour-enhancer-402-black.component';

describe('GranitoColourEnhancer402BlackComponent', () => {
  let component: GranitoColourEnhancer402BlackComponent;
  let fixture: ComponentFixture<GranitoColourEnhancer402BlackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GranitoColourEnhancer402BlackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GranitoColourEnhancer402BlackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
