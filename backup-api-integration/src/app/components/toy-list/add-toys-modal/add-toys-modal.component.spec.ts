import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToysModalComponent } from './add-toys-modal.component';

describe('AddToysModalComponent', () => {
  let component: AddToysModalComponent;
  let fixture: ComponentFixture<AddToysModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToysModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToysModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
