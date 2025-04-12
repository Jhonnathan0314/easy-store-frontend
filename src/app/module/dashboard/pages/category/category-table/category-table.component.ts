import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Category } from '@models/data/category.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './category-table.component.html'
})
export class CategoryTableComponent {

  @Input() categories: Category[] = [];

  @Input() disableButtons: boolean = false;

  @Output() deleteEvent: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() updateEvent: EventEmitter<Category> = new EventEmitter<Category>();

  updateAction(tablePaymentType: Category) {
    this.updateEvent.emit(tablePaymentType);
  }

  deleteAction(tablePaymentType: Category) {
    this.deleteEvent.emit(tablePaymentType);
  }

}
