import { Component, computed, effect, EventEmitter, Injector, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentType } from '@models/data/payment-type.model';
import { FormErrors } from '@models/security/security-error.model';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { LoadingFormComponent } from "@component/shared/skeleton/loading-form/loading-form.component";
import { InputNumberComponent } from "@component/shared/inputs/input-number/input-number.component";

@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, MessageModule, ButtonComponent, InputTextComponent, LoadingFormComponent, InputNumberComponent],
  templateUrl: './payment-type-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class PaymentTypeFormComponent {

  paymentTypeForm: FormGroup;
  formErrors: FormErrors;

  paymentTypeId: number = 0;

  paymentTypesError: Signal<ErrorMessage | null> = computed(() => this.paymentTypeService.paymentTypesError());
  paymentType: PaymentType | undefined = undefined;

  buttonLabel: string = 'Crear';
  title: string = 'Crear tipo de pago';

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);

  @Output() paymentTypeErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateAction();
  }

  initializeForm() {
    this.paymentTypeForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  validateAction() {
    this.obtainIdsFromPath();
    if(this.paymentTypeId === 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.prepareUpdateForm();
  }

  obtainIdsFromPath() {
    this.paymentTypeId = parseInt(this.activatedRoute.snapshot.params['_paymentTypeId']) ?? 0;
  }

  prepareCreateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentTypeId
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tipo de pago';
  }

  prepareUpdateForm() {
    effect(() => {
      this.paymentType = this.paymentTypeService.getById(this.paymentTypeId)();
      if(!this.paymentType) return;
      this.paymentTypeForm.patchValue({
        id: this.paymentTypeId,
        name: this.paymentType?.name
      });
    }, {injector: this.injector})
  }

  validateForm() {
    if(!this.paymentTypeForm.valid) {
      this.paymentTypeForm.markAllAsTouched();
      return;
    }
    this.executeAction();
  }

  executeAction() {
    if(this.paymentTypeId == 0) {
      this.createPaymentType();
      return;
    }
    this.updatePaymentType();
  }

  createPaymentType() {
    this.paymentTypeService.create(this.getCreateObject()).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.handleCreateError(error);
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      }
    })
  }

  getCreateObject(): PaymentType {
    return { 
      id: this.paymentTypeId,
      name: this.paymentTypeForm.value.name,
      state: 'active'
    };
  }

  handleCreateError(error: ApiResponse<ErrorMessage>) {
    if(error.error){
      if(error.error.code == 409) {
        this.messageService.add({severity: 'error', summary: error.error.detail, detail: 'Ya existe el tipo de pago ingresado.'});
        return;
      }
    }
    this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
  }

  updatePaymentType() {
    this.paymentTypeService.update(this.getUpdateObject()).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.handleUpdateError(error);
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      }
    })
  }

  getUpdateObject(): PaymentType {
    return { 
      id: this.paymentTypeId,
      name: this.paymentTypeForm.value.name,
      state: this.paymentType?.state ?? 'active'
    };
  }

  handleUpdateError(error: ApiResponse<ErrorMessage>) {
    if(error.error){
      if(error.error.code == 406) {
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
      }
      return;
    }
    this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
  }

  receiveValue(key: string, value: string | number) {
    this.paymentTypeForm.patchValue({[key]: value})
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
