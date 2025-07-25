import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LapizoBondFastSetComponent } from './lapizo-bond-fast-set.component';

describe('LapizoBondFastSetComponent', () => {
  let component: LapizoBondFastSetComponent;
  let fixture: ComponentFixture<LapizoBondFastSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LapizoBondFastSetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LapizoBondFastSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
