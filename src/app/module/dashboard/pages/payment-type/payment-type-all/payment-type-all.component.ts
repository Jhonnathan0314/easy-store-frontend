import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PaymentType } from '@models/data/payment-type.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subscription } from 'rxjs';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';

@Component({
  selector: 'app-payment-type-all',
  standalone: true,
  imports: [RouterModule, ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './payment-type-all.component.html'
})
export class PaymentTypeAllComponent implements OnInit {

  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());
  mappedPaymentTypes: DataObject[] = [];

  isLoading = true;

  paymentTypeSubscription: Subscription;

  constructor(
    private router: Router,
    private injector: Injector,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.extractMappedPaymentTypes();
  }

  extractMappedPaymentTypes() {
    effect(() => {
      if(this.paymentTypes().length === 0) return;
      this.mappedPaymentTypes = this.paymentTypes().map((pay) => ({
        id: pay.id,
        name: pay.name
      }))
      this.isLoading = false;
    }, {injector: this.injector})
  }

  deleteById(paymentType: DataObject) {
    this.paymentTypeService.deleteById(paymentType?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/payment-type/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
