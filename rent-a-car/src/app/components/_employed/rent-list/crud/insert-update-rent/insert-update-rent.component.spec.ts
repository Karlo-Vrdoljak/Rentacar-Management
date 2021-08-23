import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertUpdateRentComponent } from './insert-update-rent.component';

describe('InsertUpdateRentComponent', () => {
  let component: InsertUpdateRentComponent;
  let fixture: ComponentFixture<InsertUpdateRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertUpdateRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertUpdateRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
