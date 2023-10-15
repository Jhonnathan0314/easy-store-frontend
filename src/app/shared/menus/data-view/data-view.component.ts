import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent implements OnInit {

  sortOptions: SelectItem[];

  @Input() objects: Product[] = [];
  @Input() isOffer: boolean = false;

  sortOrder: number;
  sortField: string;

  layout: string = 'list';

  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Mayor precio', value: '!price' },
      { label: 'Menor precio', value: 'price' }
    ];
  }

  getSeverity(product: Product) {
    if (product.inventory == 0) return 'danger';
    if (product.inventory < 3) return 'warning';
    return 'success';
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    } else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}
  
}
