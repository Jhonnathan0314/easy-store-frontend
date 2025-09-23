import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category, CategoryHasPaymentType } from '@models/data/category.model';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { PaymentType } from '@models/data/payment-type.model';

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

  categoryHasPaymentTypes: CategoryHasPaymentType[] = [];

  @Output() changeStateEvent: EventEmitter<CategoryHasPaymentType> = new EventEmitter<CategoryHasPaymentType>();
  @Output() updateEvent: EventEmitter<CategoryHasPaymentType> = new EventEmitter<CategoryHasPaymentType>();

  ngOnChanges(): void {
    this.categories.forEach(category => {
      if(category.paymentTypes == null || category.paymentTypes == undefined) return;
      if(category.paymentTypes.length == 0) return;
      this.categoryHasPaymentTypes = [];
      const paymentType = this.paymentTypes.find(paymentType => paymentType.id === category.paymentTypes![0].id.paymentTypeId) ?? new PaymentType();
      this.categories.forEach(category => {
        this.categoryHasPaymentTypes = category.paymentTypes?.map(hasPaymentType => ({
          ...hasPaymentType,
          category,
          paymentType
        })) ?? [];
      })
    })
  }

  updateAction(tablePaymentType: CategoryHasPaymentType) {
    this.updateEvent.emit(tablePaymentType);
  }

  changeStateAction(tablePaymentType: CategoryHasPaymentType) {
    this.changeStateEvent.emit(tablePaymentType);
  }

}
