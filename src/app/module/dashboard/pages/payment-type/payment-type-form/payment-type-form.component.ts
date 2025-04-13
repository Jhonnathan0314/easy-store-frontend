import { Component, computed, effect, EventEmitter, Injector, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentType } from '@models/data/payment-type.model';
import { FormErrors } from '@models/security/security-error.model';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Category, CategoryHasPaymentType } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { InputSelectComponent } from "../../../../../shared/inputs/input-select/input-select.component";
import { MessageModule } from 'primeng/message';
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';

@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, MessageModule, ButtonComponent, InputNumberComponent, InputTextComponent, InputSelectComponent],
  templateUrl: './payment-type-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class PaymentTypeFormComponent {

  paymentTypeForm: FormGroup;
  formErrors: FormErrors;

  categoryId: number = 0;
  paymentTypeId: number = 0;

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  mappedCategories: PrimeNGObject[] = [];

  paymentTypesError: Signal<ErrorMessage | null> = computed(() => this.paymentTypeService.paymentTypesError());
  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());
  mappedPaymentTypes: PrimeNGObject[] = [];

  categoryHasPaymentType: CategoryHasPaymentType = new CategoryHasPaymentType();

  buttonLabel: string = 'Agregar';
  title: string = 'Agregar tipo de pago';

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  showCategoryCreatedMessage: boolean = false;

  @Output() paymentTypeErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.validateCategories();
    this.validatePaymentTypes();
    this.validateAction();
  }

  validateCategories() {
    effect(() => {
      if(this.categories().length === 0) return;
      this.mappedCategories = this.categories().map((category: Category) => {
        return { name: category.name, value: `${category.id}` };
      })
      this.validateParams();
    }, {injector: this.injector})
  }

  validatePaymentTypes() {
    effect(() => {
      if(this.paymentTypes().length === 0) return;
      this.mappedPaymentTypes = this.paymentTypes().map((paymentType: PaymentType) => {
        return { name: paymentType.name, value: `${paymentType.id}` };
      })
      this.validateParams();
    }, {injector: this.injector})
  }

  validateParams() {
    if(this.paymentTypeId !== 0 && this.categoryId !== 0) {
      this.getCategoryHasPaymentType();
      this.prepareUpdateForm();
    } else if (this.categoryId !== 0) {
      this.paymentTypeForm.patchValue({ categoryId: `${this.categoryId}` });
      this.showCategoryCreatedMessage = true;
    }
  }

  getCategoryHasPaymentType() {
    const category = this.categories().find(category => category.id === this.categoryId) ?? new Category();

    if(category == null || category == undefined) return;
    if(category.paymentTypes == null || category.paymentTypes == undefined) return;
    if(category.paymentTypes.length == 0) return;

    this.categoryHasPaymentType = category.paymentTypes?.find(paymentType => paymentType.id.paymentTypeId === this.paymentTypeId) ?? new CategoryHasPaymentType();
  }

  validateAction() {
    this.obtainIdsFromPath();
    this.initializeForm();
    if(this.paymentTypeId === 0 || this.categoryId === 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
  }

  obtainIdsFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_categoryId']) ?? 0;
    this.paymentTypeId = parseInt(this.activatedRoute.snapshot.params['_paymentTypeId']) ?? 0;
  }

  initializeForm() {
    this.paymentTypeForm = this.formBuilder.group({
      category: [null, [Validators.required]],
      paymentType: [null, [Validators.required]],
      phone: null,
      email: '',
      accountNumber: '',
      accountType: '',
      accountBank: ''
    });
  }

  prepareCreateForm() {
    this.paymentTypeForm.patchValue({
      category: this.categoryId !== 0 ? `${this.categoryId}` : null,
      paymentType: null,
      phone: null,
      email: '',
      accountNumber: '',
      accountType: '',
      accountBank: ''
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tipo de pago';
  }

  prepareUpdateForm() {
    this.paymentTypeForm.patchValue({
      category: `${this.categoryId}`,
      paymentType: `${this.paymentTypeId}`,
      phone: this.categoryHasPaymentType.phone,
      email: this.categoryHasPaymentType.email,
      accountNumber: this.categoryHasPaymentType.accountNumber,
      accountType: this.categoryHasPaymentType.accountType,
      accountBank: this.categoryHasPaymentType.accountBank
    })
  }

  validateForm() {
    if(!this.paymentTypeForm.valid) {
      this.paymentTypeForm.markAllAsTouched();
      return;
    }
    if(this.buttonLabel === 'Agregar') {
      this.create();
    }else {
      this.update();
    }
  }

  create() {
    this.categoryService.createCategoryHasPaymentType(this.getObject()).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 409) {
            this.messageService.add({severity: 'error', summary: error.error.detail, detail: 'Ya existe el tipo de pago ingresado.'});
            return;
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      }
    })
  }

  update() {
    this.categoryService.updateCategoryHasPaymentType(this.getObject()).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 406) {
            this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
          }
          return;
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      }
    })
  }

  getObject(): CategoryHasPaymentType {
    return { 
      id: {
        categoryId: this.paymentTypeForm.value.category,
        paymentTypeId: this.paymentTypeForm.value.paymentType
      },
      phone: this.paymentTypeForm.value.phone,
      email: this.paymentTypeForm.value.email,
      accountNumber: this.paymentTypeForm.value.accountNumber,
      accountType: this.paymentTypeForm.value.accountType,
      accountBank: this.paymentTypeForm.value.accountBank,
      state: 'active'
    };
  }

  receiveValue(key: string, value: string | number) {
    this.paymentTypeForm.patchValue({[key]: value})
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
