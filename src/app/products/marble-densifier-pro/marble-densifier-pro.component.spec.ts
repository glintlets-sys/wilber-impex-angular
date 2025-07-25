import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleDensifierProComponent } from './marble-densifier-pro.component';

describe('MarbleDensifierProComponent', () => {
  let component: MarbleDensifierProComponent;
  let fixture: ComponentFixture<MarbleDensifierProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleDensifierProComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleDensifierProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
