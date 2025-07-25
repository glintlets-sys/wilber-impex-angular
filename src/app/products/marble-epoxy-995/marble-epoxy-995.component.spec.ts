import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleEpoxy995Component } from './marble-epoxy-995.component';

describe('MarbleEpoxy995Component', () => {
  let component: MarbleEpoxy995Component;
  let fixture: ComponentFixture<MarbleEpoxy995Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleEpoxy995Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleEpoxy995Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
