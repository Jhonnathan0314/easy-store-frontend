import { Component, effect, EventEmitter, Injector, Output } from '@angular/core';
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
  paymentType: PaymentType | undefined = undefined;

  buttonLabel: string = 'Crear';
  title: string = 'Crear tipo de pago';

  isLoading: boolean = true;

  @Output() paymentTypeErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
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
      name: ['', [Validators.required]]
    });
  }

  validateAction() {
    this.obtainIdFromPath();
    if(this.paymentTypeId === 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.prepareUpdateForm();
  }

  obtainIdFromPath() {
    this.paymentTypeId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  prepareCreateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentTypeId
    })
    this.isLoading = false;
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
        name: this.paymentType.name
      })
      this.isLoading = false;
    }, {injector: this.injector})
  }

  validateForm() {
    if(!this.paymentTypeForm.valid) {
      this.paymentTypeForm.markAllAsTouched();
      return;
    }
    if(this.buttonLabel === 'Crear') {
      this.createCategory();
    }else {
      this.updateCategory();
    }
  }

  createCategory() {
    this.paymentTypeService.create(this.getObject()).subscribe({
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
    this.paymentTypeService.update(this.getObject()).subscribe({
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

  getObject() {
    return { ...this.paymentTypeForm.value };
  }

  receiveValue(key: string, value: string) {
    this.paymentTypeForm.patchValue({[key]: value})
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
