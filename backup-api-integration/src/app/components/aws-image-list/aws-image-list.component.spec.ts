import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwsImageListComponent } from './aws-image-list.component';

describe('AwsImageListComponent', () => {
  let component: AwsImageListComponent;
  let fixture: ComponentFixture<AwsImageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AwsImageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwsImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
