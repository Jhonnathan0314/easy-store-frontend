import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Subcategory } from '@models/data/subcategory.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-subcategory-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './subcategory-table.component.html'
})
export class SubcategoryTableComponent {

  @Input() subcategories: Subcategory[] = [];

  @Input() disableButtons: boolean = false;

  @Output() deleteEvent: EventEmitter<Subcategory> = new EventEmitter<Subcategory>();
  @Output() updateEvent: EventEmitter<Subcategory> = new EventEmitter<Subcategory>();

  updateAction(subcategory: Subcategory) {
    this.updateEvent.emit(subcategory);
  }

  deleteAction(subcategory: Subcategory) {
    this.deleteEvent.emit(subcategory);
  }

}
