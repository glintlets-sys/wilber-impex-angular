import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleDensifierRegularComponent } from './marble-densifier-regular.component';

describe('MarbleDensifierRegularComponent', () => {
  let component: MarbleDensifierRegularComponent;
  let fixture: ComponentFixture<MarbleDensifierRegularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleDensifierRegularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleDensifierRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
