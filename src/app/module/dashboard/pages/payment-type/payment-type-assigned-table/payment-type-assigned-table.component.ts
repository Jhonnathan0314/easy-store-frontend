import { TablePaymentType } from './../../../../../core/models/data-types/data/payment-type.model';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category } from '@models/data/category.model';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { PaymentType } from '@models/data/payment-type.model';
import { convertToTablePaymentType } from 'src/app/core/utils/mapper/payment-type-mapper.util';

@Component({
  selector: 'app-payment-type-assigned-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './payment-type-assigned-table.component.html'
})
export class PaymentTypeAssignedTableComponent implements OnChanges {

  @Input() categories: Category[] = [];
  @Input() paymentTypes: PaymentType[] = [];

  @Input() disableButtons: boolean = false;

  tablePaymentTypes: TablePaymentType[] = [];

  @Output() changeStateEvent: EventEmitter<TablePaymentType> = new EventEmitter<TablePaymentType>();
  @Output() updateEvent: EventEmitter<TablePaymentType> = new EventEmitter<TablePaymentType>();

  ngOnChanges(): void {
    this.categories.forEach(category => {
      if(category.paymentTypes == null || category.paymentTypes == undefined) return;
      if(category.paymentTypes.length == 0) return;
      this.tablePaymentTypes = [];
      const paymentType = this.paymentTypes.find(paymentType => paymentType.id === category.paymentTypes![0].id.paymentTypeId) ?? new PaymentType();
      this.categories.forEach(category => {
        this.tablePaymentTypes = this.tablePaymentTypes.concat(convertToTablePaymentType(paymentType, category));
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
