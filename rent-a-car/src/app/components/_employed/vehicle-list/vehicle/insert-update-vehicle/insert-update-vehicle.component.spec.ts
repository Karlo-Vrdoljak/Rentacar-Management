import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertUpdateVehicleComponent } from './insert-update-vehicle.component';

describe('InsertUpdateVehicleComponent', () => {
  let component: InsertUpdateVehicleComponent;
  let fixture: ComponentFixture<InsertUpdateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertUpdateVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertUpdateVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
