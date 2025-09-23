import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeAssignedFormComponent } from './payment-type-assigned-form.component';

describe('PaymentTypeAssignedFormComponent', () => {
  let component: PaymentTypeAssignedFormComponent;
  let fixture: ComponentFixture<PaymentTypeAssignedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeAssignedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeAssignedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
