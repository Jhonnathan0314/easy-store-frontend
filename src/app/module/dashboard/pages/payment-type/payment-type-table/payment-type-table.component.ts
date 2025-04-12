import { TablePaymentType } from './../../../../../core/models/data-types/data/payment-type.model';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category } from '@models/data/category.model';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { PaymentType } from '@models/data/payment-type.model';
import { PaymentTypePipe } from 'src/app/core/pipes/payment-type/payment-type.pipe';

@Component({
  selector: 'app-payment-type-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './payment-type-table.component.html',
  providers: [PaymentTypePipe]
})
export class PaymentTypeTableComponent implements OnChanges {

  @Input() categories: Category[] = [];
  @Input() paymentTypes: PaymentType[] = [];

  @Input() disableButtons: boolean = false;

  tablePaymentTypes: TablePaymentType[] = [];

  @Output() changeStateEvent: EventEmitter<TablePaymentType> = new EventEmitter<TablePaymentType>();
  @Output() updateEvent: EventEmitter<TablePaymentType> = new EventEmitter<TablePaymentType>();

  constructor(private paymentTypePipe: PaymentTypePipe) { }

  ngOnChanges(): void {
    this.categories.forEach(category => {
      if(category.paymentTypes == null || category.paymentTypes == undefined) return;
      if(category.paymentTypes.length == 0) return;
      this.tablePaymentTypes = [];
      const paymentType = this.paymentTypes.find(paymentType => paymentType.id === category.paymentTypes![0].id.paymentTypeId) ?? new PaymentType();
      this.categories.forEach(category => {
        this.tablePaymentTypes = this.tablePaymentTypes.concat(this.paymentTypePipe.convertToTablePaymentType(paymentType, category));
      })
    })
  }

  updateAction(tablePaymentType: TablePaymentType) {
    this.updateEvent.emit(tablePaymentType);
  }

  changeStateAction(tablePaymentType: TablePaymentType) {
    this.changeStateEvent.emit(tablePaymentType);
  }

}
