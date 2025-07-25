import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuAdhesiveComponent } from './pu-adhesive.component';

describe('PuAdhesiveComponent', () => {
  let component: PuAdhesiveComponent;
  let fixture: ComponentFixture<PuAdhesiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuAdhesiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuAdhesiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
