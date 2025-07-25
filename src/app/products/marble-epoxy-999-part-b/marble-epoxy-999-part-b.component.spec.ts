import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleEpoxy999PartBComponent } from './marble-epoxy-999-part-b.component';

describe('MarbleEpoxy999PartBComponent', () => {
  let component: MarbleEpoxy999PartBComponent;
  let fixture: ComponentFixture<MarbleEpoxy999PartBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleEpoxy999PartBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleEpoxy999PartBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
