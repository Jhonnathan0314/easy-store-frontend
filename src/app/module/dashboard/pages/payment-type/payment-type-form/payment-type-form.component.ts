import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentType } from '@models/data/payment-type.model';
import { FormErrors } from '@models/security/security-error.model';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";

@Component({
  selector: 'app-payment-type-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ButtonComponent, InputNumberComponent, InputTextComponent],
  templateUrl: './payment-type-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css']
})
export class PaymentTypeFormComponent {

  paymentTypeForm: FormGroup;
  formErrors: FormErrors;

  paymentType: PaymentType = new PaymentType();

  buttonLabel: string = 'Crear';
  title: string = 'Crear tipo de pago';

  @Output() paymentTypeErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private paymentTypeService: PaymentTypeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtainIdFromPath();
    this.findCategoryById();
  }

  obtainIdFromPath() {
    this.paymentType.id = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  findCategoryById() {
    if(this.isCreate()) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.paymentTypeService.getById(this.paymentType.id).subscribe({
      next: (response) => {
        this.paymentType = response || new PaymentType();
        this.prepareUpdateForm();
      },
      error: (error) => {
        console.log("Ha ocurrido un error al obtener tipo de pago por id. ", error);
      }
    })
  }

  isCreate(): boolean {
    return this.paymentType.id === 0;
  }

  prepareCreateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentType.id
    })
  }

  prepareUpdateForm() {
    this.paymentTypeForm.patchValue({
      id: this.paymentType.id,
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
    this.paymentTypeService.create(this.paymentType).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/payment-type');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear tipo de pago.", error);
      }
    })
  }

  updateCategory() {
    this.paymentTypeService.update(this.paymentType).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/payment-type');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear tipo de pago.", error);
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
