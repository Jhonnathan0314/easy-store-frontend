import { Component } from '@angular/core';
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
export class PaymentTypeAllComponent {

  paymentTypes: PaymentType[] = [];
  mappedPaymentTypes: DataObject[] = [];

  isLoading = true;

  paymentTypeSubscription: Subscription;

  constructor(
    private router: Router,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openSubscriptions() {
    this.paymentTypeSubscription = this.paymentTypeService.storedPaymentTypes$.subscribe({
      next: (paymentTypes) => {
        if(paymentTypes.length == 0) return;
        this.paymentTypes = paymentTypes;
        this.convertToDataObject();
        this.isLoading = false;
      },
      error: (error) => {
        console.log('Ha ocurrido un error: ', {error});
      }
    })
  }

  closeSubscriptions() {
    this.paymentTypeSubscription.unsubscribe();
  }

  convertToDataObject() {
    this.mappedPaymentTypes = this.paymentTypes.map(pay => {
      return {
        id: pay.id,
        name: pay.name
      }
    })
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
