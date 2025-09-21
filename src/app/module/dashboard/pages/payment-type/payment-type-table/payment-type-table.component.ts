import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { PaymentType } from '@models/data/payment-type.model';

@Component({
  selector: 'app-payment-type-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './payment-type-table.component.html'
})
export class PaymentTypeTableComponent {

  @Input() paymentTypes: PaymentType[] = [];

  @Input() disableButtons: boolean = false;

  @Output() changeStateEvent: EventEmitter<PaymentType> = new EventEmitter<PaymentType>();
  @Output() updateEvent: EventEmitter<PaymentType> = new EventEmitter<PaymentType>();

  updateAction(paymentTypes: PaymentType) {
    this.updateEvent.emit(paymentTypes);
  }

  changeStateAction(paymentTypes: PaymentType) {
    this.changeStateEvent.emit(paymentTypes);
  }

}
