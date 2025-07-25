import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GelW100ProductComponent } from './gel-w-100-product.component';

describe('GelW100ProductComponent', () => {
  let component: GelW100ProductComponent;
  let fixture: ComponentFixture<GelW100ProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GelW100ProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GelW100ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
