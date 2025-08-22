import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAdminUserComponent } from './add-edit-admin-user.component';

describe('AddEditAdminUserComponent', () => {
  let component: AddEditAdminUserComponent;
  let fixture: ComponentFixture<AddEditAdminUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAdminUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAdminUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
