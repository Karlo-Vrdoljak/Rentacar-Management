import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRentComponent } from './view-rent.component';

describe('ViewRentComponent', () => {
  let component: ViewRentComponent;
  let fixture: ComponentFixture<ViewRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
