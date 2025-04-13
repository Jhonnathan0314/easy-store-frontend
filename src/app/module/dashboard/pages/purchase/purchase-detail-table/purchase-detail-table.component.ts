import { Component, Input } from '@angular/core';
import { Purchase } from '@models/data/purchase.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-purchase-detail-table',
  standalone: true,
  imports: [TableModule],
  templateUrl: './purchase-detail-table.component.html'
})
export class PurchaseDetailTableComponent {

  @Input() purchase: Purchase = new Purchase();

}
