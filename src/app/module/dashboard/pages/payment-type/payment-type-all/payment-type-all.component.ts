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
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { PaymentTypeAssignedTableComponent } from "../payment-type-assigned-table/payment-type-assigned-table.component";

@Component({
  selector: 'app-payment-type-all',
  standalone: true,
  imports: [RouterModule, MessageModule, ButtonComponent, LoadingTableComponent, PaymentTypeTableComponent, PaymentTypeAssignedTableComponent],
  templateUrl: './payment-type-all.component.html'
})
export class PaymentTypeAllComponent implements OnInit {

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());

  paymentTypesError: Signal<ErrorMessage | null> = computed(() => this.paymentTypeService.paymentTypesError());
  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private categoryService: CategoryService,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.validatePaymentTypesError();
  }

  validatePaymentTypesError() {
    effect(() => {
      if(this.categoriesError() == null || this.paymentTypesError() == null) return;
      if(this.categoriesError()?.code !== 404 || this.paymentTypesError()?.code !== 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  goAddPaymentType() {
    this.router.navigateByUrl('/dashboard/payment-type/form/0');
  }

  goAddCategoryPaymentType() {
    this.router.navigateByUrl('/dashboard/payment-type/form/category/0/payment-type/0');
  }

  updatePaymentType(paymentType: PaymentType) {
    this.router.navigateByUrl(`/dashboard/payment-type/form/${paymentType.id}`);
  }

  updateCategoryPaymentType(tablePaymentType: TablePaymentType) {
    this.router.navigateByUrl(`/dashboard/payment-type/form/category/${tablePaymentType.category.id}/payment-type/${tablePaymentType.paymentType.id}`);
  }

  changeStatePaymentType(paymentType: PaymentType) {
    this.paymentTypeService.changeStatePaymentType(paymentType.id).subscribe({
      error: () => {
        this.hasUnexpectedError = true;
      }
    });
  }

  changeStateCategoryPaymentType(tablePaymentType: TablePaymentType) {
    const id: CategoryHasPaymentTypeId = {
      categoryId: tablePaymentType.category.id,
      paymentTypeId: tablePaymentType.paymentType.id
    }
    this.categoryService.changeStateCategoryHasPaymentType(id).subscribe({
      error: () => {
        this.hasUnexpectedError = true;
      }
    })
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
