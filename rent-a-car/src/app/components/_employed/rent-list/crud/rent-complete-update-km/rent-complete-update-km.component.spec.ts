import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCompleteUpdateKmComponent } from './rent-complete-update-km.component';

describe('RentCompleteUpdateKmComponent', () => {
  let component: RentCompleteUpdateKmComponent;
  let fixture: ComponentFixture<RentCompleteUpdateKmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCompleteUpdateKmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentCompleteUpdateKmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
