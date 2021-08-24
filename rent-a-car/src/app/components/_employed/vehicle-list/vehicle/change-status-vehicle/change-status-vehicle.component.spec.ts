import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusVehicleComponent } from './change-status-vehicle.component';

describe('ChangeStatusVehicleComponent', () => {
  let component: ChangeStatusVehicleComponent;
  let fixture: ComponentFixture<ChangeStatusVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStatusVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
