import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UvProtectedColourTintComponent } from './uv-protected-colour-tint.component';

describe('UvProtectedColourTintComponent', () => {
  let component: UvProtectedColourTintComponent;
  let fixture: ComponentFixture<UvProtectedColourTintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UvProtectedColourTintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UvProtectedColourTintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
