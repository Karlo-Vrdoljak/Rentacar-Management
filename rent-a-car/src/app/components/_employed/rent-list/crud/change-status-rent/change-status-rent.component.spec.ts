import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusRentComponent } from './change-status-rent.component';

describe('ChangeStatusRentComponent', () => {
  let component: ChangeStatusRentComponent;
  let fixture: ComponentFixture<ChangeStatusRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStatusRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStatusRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
