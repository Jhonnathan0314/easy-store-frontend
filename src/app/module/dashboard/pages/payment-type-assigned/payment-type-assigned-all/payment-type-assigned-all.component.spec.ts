import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeAssignedAllComponent } from './payment-type-assigned-all.component';

describe('PaymentTypeAssignedAllComponent', () => {
  let component: PaymentTypeAssignedAllComponent;
  let fixture: ComponentFixture<PaymentTypeAssignedAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeAssignedAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeAssignedAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
