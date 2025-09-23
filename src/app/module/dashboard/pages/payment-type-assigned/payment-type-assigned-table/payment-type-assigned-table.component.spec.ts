import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeAssignedTableComponent } from './payment-type-assigned-table.component';

describe('PaymentTypeAssignedTableComponent', () => {
  let component: PaymentTypeAssignedTableComponent;
  let fixture: ComponentFixture<PaymentTypeAssignedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeAssignedTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeAssignedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
