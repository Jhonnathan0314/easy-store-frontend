import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@models/data/product.model';
import { SelectItem } from 'primeng/api';
import { DataViewLayout } from 'src/app/core/models/enums/primeng.enum';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputRatingComponent } from '@component/shared/inputs/input-rating/input-rating.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [DataViewModule, DropdownModule, TagModule, ButtonModule, InputRatingComponent],
  templateUrl: './data-view.component.html'
})
export class DataViewComponent implements OnInit {

  sortOptions: SelectItem[];

  @Input() objects: Product[] = [];
  @Input() isOffer: boolean = false;

  sortOrder: number;
  sortField: string;

  layout: DataViewLayout = DataViewLayout.LIST;

  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Mayor precio', value: '!price' },
      { label: 'Menor precio', value: 'price' }
    ];
  }

  getSeverity(product: Product): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    if (product.quantity == 0) return 'danger';
    if (product.quantity < 3) return 'warn';
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
