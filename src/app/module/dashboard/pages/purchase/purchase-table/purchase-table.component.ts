import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Purchase } from '@models/data/purchase.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-purchase-table',
  standalone: true,
  imports: [TableModule, ButtonComponent],
  templateUrl: './purchase-table.component.html'
})
export class PurchaseTableComponent {

  @Input() purchases: Purchase[] = [];

  @Input() disableButtons: boolean = false;

  @Output() viewDetailEvent: EventEmitter<Purchase> = new EventEmitter<Purchase>();

  viewDetailAction(purchase: Purchase) {
    this.viewDetailEvent.emit(purchase);
  }

}
