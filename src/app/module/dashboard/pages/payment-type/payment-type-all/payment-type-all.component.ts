import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { Category, CategoryHasPaymentTypeId } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PaymentTypeTableComponent } from "../payment-type-table/payment-type-table.component";
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { PaymentType, TablePaymentType } from '@models/data/payment-type.model';

@Component({
  selector: 'app-payment-type-all',
  standalone: true,
  imports: [RouterModule, MessageModule, ButtonComponent, LoadingTableComponent, PaymentTypeTableComponent],
  templateUrl: './payment-type-all.component.html'
})
export class PaymentTypeAllComponent implements OnInit {

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());

  paymentTypesError: Signal<ErrorMessage | null> = computed(() => this.paymentTypeService.paymentTypesError());
  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private categoryService: CategoryService,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.extractMappedPaymentTypes();
    this.validatePaymentTypesError();
  }

  extractMappedPaymentTypes() {
    effect(() => {
      this.isLoading = false;
      if(this.isWorking) this.isWorking = false;
    }, {injector: this.injector})
  }

  validatePaymentTypesError() {
    effect(() => {
      if(this.categoriesError() == null || this.paymentTypesError() == null) return;
      if(this.categoriesError()?.code !== 404 || this.paymentTypesError()?.code !== 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  goAdd() {
    this.router.navigateByUrl('/dashboard/payment-type/form/category/0/payment-type/0');
  }

  update(tablePaymentType: TablePaymentType) {
    this.router.navigateByUrl(`/dashboard/payment-type/form/category/${tablePaymentType.category.id}/payment-type/${tablePaymentType.paymentType.id}`);
  }

  changeState(tablePaymentType: TablePaymentType) {
    const id: CategoryHasPaymentTypeId = {
      categoryId: tablePaymentType.category.id,
      paymentTypeId: tablePaymentType.paymentType.id
    }
    this.isWorking = true;
    this.categoryService.changeStateCategoryHasPaymentType(id).subscribe({
      error: () => {
        this.isWorking = false;
        this.hasUnexpectedError = true;
      },
      complete: () => {
        this.isWorking = false;
      }
    })
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
