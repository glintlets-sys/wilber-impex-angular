import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurfaceProtectiveCoating315Component } from './surface-protective-coating-315.component';

describe('SurfaceProtectiveCoating315Component', () => {
  let component: SurfaceProtectiveCoating315Component;
  let fixture: ComponentFixture<SurfaceProtectiveCoating315Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurfaceProtectiveCoating315Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurfaceProtectiveCoating315Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
