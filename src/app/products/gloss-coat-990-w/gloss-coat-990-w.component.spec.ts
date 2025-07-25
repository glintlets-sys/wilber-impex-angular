import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossCoat990WComponent } from './gloss-coat-990-w.component';

describe('GlossCoat990WComponent', () => {
  let component: GlossCoat990WComponent;
  let fixture: ComponentFixture<GlossCoat990WComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossCoat990WComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossCoat990WComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
