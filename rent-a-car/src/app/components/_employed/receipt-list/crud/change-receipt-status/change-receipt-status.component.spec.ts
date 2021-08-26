import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeReceiptStatusComponent } from './change-receipt-status.component';

describe('ChangeReceiptStatusComponent', () => {
  let component: ChangeReceiptStatusComponent;
  let fixture: ComponentFixture<ChangeReceiptStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeReceiptStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeReceiptStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
