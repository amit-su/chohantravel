import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverHelperAttendanceComponent } from './driver-helper-attendance.component';

describe('DriverHelperAttendanceComponent', () => {
  let component: DriverHelperAttendanceComponent;
  let fixture: ComponentFixture<DriverHelperAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverHelperAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverHelperAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
