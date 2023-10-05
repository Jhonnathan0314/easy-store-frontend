import { Component, Input } from '@angular/core';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent {

  @Input() objects: Product[] = [];
  @Input() isOffer: boolean = false;

  layout: string = 'list';

  getSeverity(product: Product) {
    if (product.inventory == 0) return 'danger';
    if (product.inventory < 3) return 'warning';
    return 'success';
  }
  
}
