import { Component, computed, EventEmitter, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputNumberComponent } from '@component/shared/inputs/input-number/input-number.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { Subcategory } from '@models/data/subcategory.model';
import { FormErrors } from '@models/security/security-error.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { InputSelectComponent } from "../../../../../shared/inputs/input-select/input-select.component";
import { Category } from '@models/data/category.model';
import { Subscription } from 'rxjs';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrimeNGObject } from '@models/utils/primeng-object.model';

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ToastModule, ButtonComponent, InputTextComponent, InputNumberComponent, InputSelectComponent],
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class SubcategoryFormComponent {

  subcategoryForm: FormGroup;
  formErrors: FormErrors;

  subcategoryId: number = 0;
  subcategory: Signal<Subcategory | undefined> = computed<Subcategory | undefined>(() => this.subcategoryService.subcategories().find(sub => sub.id == this.subcategoryId));
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());
  mappedCategories: Signal<PrimeNGObject[]> = computed<PrimeNGObject[]>(() => 
    this.categoryService.categories().map(cat => ({
      value: `${cat.id}`,
      name: cat.name
    }))
  );

  buttonLabel: string = 'Crear';
  title: string = 'Crear categoria';

  isLoading: boolean = true;

  categorySubscription: Subscription;

  @Output() subcategoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateAction();
  }

  initializeForm() {
    this.subcategoryForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  validateAction() {
    this.obtainIdFromPath();
    if(this.subcategoryId == 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.prepareUpdateForm();
  }

  obtainIdFromPath() {
    this.subcategoryId = parseInt(this.activatedRoute.snapshot.params['_id'] ?? 0);
  }

  prepareCreateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategoryId
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar categoria';
  }

  prepareUpdateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategoryId,
      name: this.subcategory.name,
      categoryId: `${this.subcategory()?.categoryId}`
    })
  }

  receiveValue(key: string, value: string | number) {
    this.subcategoryForm.patchValue({ [key]: value })
  }

  validateForm() {
    if(!this.subcategoryForm.valid) {
      this.subcategoryForm.markAllAsTouched();
      return;
    }
    if(this.buttonLabel === 'Crear') {
      this.createSubcategory();
    }else {
      this.updateSubcategory();
    }
  }

  createSubcategory() {
    this.subcategoryService.create(this.subcategory() || new Subcategory()).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/category');
      }
    })
  }

  updateSubcategory() {
    this.subcategoryService.update(this.subcategory() || new Subcategory()).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error) {
          if(error.error.code == 406) {
            this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
    })
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
