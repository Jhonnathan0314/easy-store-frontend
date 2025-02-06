import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeAllComponent } from './payment-type-all.component';

describe('PaymentTypeAllComponent', () => {
  let component: PaymentTypeAllComponent;
  let fixture: ComponentFixture<PaymentTypeAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
