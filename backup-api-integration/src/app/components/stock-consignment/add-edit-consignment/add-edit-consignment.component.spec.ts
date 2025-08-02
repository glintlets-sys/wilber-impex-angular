import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditConsignmentComponent } from './add-edit-consignment.component';

describe('AddEditConsignmentComponent', () => {
  let component: AddEditConsignmentComponent;
  let fixture: ComponentFixture<AddEditConsignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditConsignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditConsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
