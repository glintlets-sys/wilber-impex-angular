import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JetNeroBlack460Component } from './jet-nero-black-460.component';

describe('JetNeroBlack460Component', () => {
  let component: JetNeroBlack460Component;
  let fixture: ComponentFixture<JetNeroBlack460Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JetNeroBlack460Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JetNeroBlack460Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
