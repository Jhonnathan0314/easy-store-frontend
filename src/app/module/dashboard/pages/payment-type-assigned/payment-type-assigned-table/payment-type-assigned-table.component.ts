import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Category, CategoryHasPaymentType, CategoryHasPaymentTypeId } from '@models/data/category.model';
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
  @Output() deleteEvent: EventEmitter<CategoryHasPaymentTypeId> = new EventEmitter<CategoryHasPaymentTypeId>();

  ngOnChanges(): void {
    this.categoryHasPaymentTypes = [];
    this.categories.forEach(category => {
      if(category.paymentTypes == null || category.paymentTypes == undefined) return;
      if(category.paymentTypes.length == 0) return;
      const paymentType = this.paymentTypes.find(paymentType => paymentType.id === category.paymentTypes![0].id.paymentTypeId) ?? new PaymentType();
      const categoryHasPaymentType: CategoryHasPaymentType | undefined = category.paymentTypes?.find(cpt => cpt.id.paymentTypeId === paymentType.id && cpt.id.categoryId === category.id) ?? undefined;
      if(categoryHasPaymentType) {
        categoryHasPaymentType.paymentType = paymentType;
        categoryHasPaymentType.category = category;
        this.categoryHasPaymentTypes.push(categoryHasPaymentType);
      }
    })
  }

  updateAction(tablePaymentType: CategoryHasPaymentType) {
    this.updateEvent.emit(tablePaymentType);
  }

  changeStateAction(tablePaymentType: CategoryHasPaymentType) {
    this.changeStateEvent.emit(tablePaymentType);
  }

  deleteAction(tablePaymentType: CategoryHasPaymentType) {
    this.deleteEvent.emit(tablePaymentType.id);
  }

}
