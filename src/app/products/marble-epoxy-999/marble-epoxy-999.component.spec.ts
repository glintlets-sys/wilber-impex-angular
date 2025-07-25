import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleEpoxy999Component } from './marble-epoxy-999.component';

describe('MarbleEpoxy999Component', () => {
  let component: MarbleEpoxy999Component;
  let fixture: ComponentFixture<MarbleEpoxy999Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleEpoxy999Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleEpoxy999Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
