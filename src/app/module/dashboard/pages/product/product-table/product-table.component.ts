import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Product } from '@models/data/product.model';
import { TableModule } from 'primeng/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './product-table.component.html'
})
export class ProductTableComponent {

  @Input() products: Product[] = [];

  @Input() disableButtons: boolean = false;

  @Output() deleteEvent: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() updateEvent: EventEmitter<Product> = new EventEmitter<Product>();

  PRODUCT_IMAGE_NAME: string = environment.DEFAULT_IMAGE_PRODUCT_NAME;

  updateAction(product: Product) {
    this.updateEvent.emit(product);
  }

  deleteAction(product: Product) {
    this.deleteEvent.emit(product);
  }

}
