import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Category } from '@models/data/category.model';
import { TableModule } from 'primeng/table';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [ImagePipe, TableModule, ButtonComponent],
  templateUrl: './category-table.component.html'
})
export class CategoryTableComponent {

  @Input() categories: Category[] = [];

  @Input() disableButtons: boolean = false;

  @Output() deleteEvent: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() updateEvent: EventEmitter<Category> = new EventEmitter<Category>();

  CATEGORY_IMAGE_NAME: string = environment.DEFAULT_IMAGE_CATEGORY_NAME;

  updateAction(category: Category) {
    this.updateEvent.emit(category);
  }

  deleteAction(category: Category) {
    this.deleteEvent.emit(category);
  }

}
