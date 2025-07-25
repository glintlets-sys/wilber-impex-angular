import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleEpoxy999PartAComponent } from './marble-epoxy-999-part-a.component';

describe('MarbleEpoxy999PartAComponent', () => {
  let component: MarbleEpoxy999PartAComponent;
  let fixture: ComponentFixture<MarbleEpoxy999PartAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleEpoxy999PartAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleEpoxy999PartAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
