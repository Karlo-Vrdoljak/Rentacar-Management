import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertEditReceiptComponent } from './insert-edit-receipt.component';

describe('InsertEditReceiptComponent', () => {
  let component: InsertEditReceiptComponent;
  let fixture: ComponentFixture<InsertEditReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertEditReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertEditReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
