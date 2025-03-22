import { Component, computed, EventEmitter, Output, Signal } from '@angular/core';
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

@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, ButtonComponent, InputNumberComponent, InputTextComponent],
  templateUrl: './payment-type-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class PaymentTypeFormComponent {

  paymentTypeForm: FormGroup;
  formErrors: FormErrors;

  paymentTypeId: number = 0;
  paymentType: Signal<PaymentType | undefined> = computed<PaymentType | undefined>(() => this.paymentTypeService.paymentTypes().find((paymentType) => paymentType.id === this.paymentTypeId));

  buttonLabel: string = 'Crear';
  title: string = 'Crear tipo de pago';

  @Output() paymentTypeErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtainIdFromPath();
    this.findCategoryById();
  }

  obtainIdFromPath() {
    this.paymentTypeId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  findCategoryById() {
    if(this.isCreate()) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
  }

  isCreate(): boolean {
    return this.paymentTypeId === 0;
  }

  prepareCreateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentTypeId
    })
  }

  prepareUpdateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentTypeId,
      name: this.paymentType.name
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tipo de pago';
  }

  initializeForm() {
    this.paymentTypeForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]]
    });
  }

  receiveValueString(key: string, value: string) {
    this.paymentTypeForm.value[key] = value;
  }

  receiveValueNumber(key: string, value: number) {
    this.paymentTypeForm.value[key] = value;
  }

  validateForm() {
    if(!this.paymentTypeForm.valid) {
      this.paymentTypeForm.markAllAsTouched();
      return;
    }
    this.getCategoryObject();
    if(this.buttonLabel === 'Crear') {
      this.createCategory();
    }else {
      this.updateCategory();
    }
  }

  createCategory() {
    this.paymentTypeService.create(this.paymentType() || new PaymentType()).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 409) {
            this.messageService.add({severity: 'error', summary: error.error.detail, detail: 'Ya existe un tipo de pago con el mismo nombre.'});
            return;
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      }
    })
  }

  updateCategory() {
    this.paymentTypeService.update(this.paymentType() || new PaymentType()).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/payment-type');
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 406) {
            this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
          }
          return;
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      }
    })
  }

  getCategoryObject() {
    this.paymentType = { ...this.paymentTypeForm.value };
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
