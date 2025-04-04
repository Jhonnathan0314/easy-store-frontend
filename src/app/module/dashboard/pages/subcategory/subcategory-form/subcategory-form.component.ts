import { Component, computed, effect, EventEmitter, Injector, OnInit, Output, Signal } from '@angular/core';
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
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { LoadingFormComponent } from "../../../../../shared/skeleton/loading-form/loading-form.component";
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ToastModule, MessageModule, ButtonComponent, InputTextComponent, InputNumberComponent, InputSelectComponent, LoadingFormComponent],
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class SubcategoryFormComponent implements OnInit {

  subcategoryForm: FormGroup;
  formErrors: FormErrors;

  subcategoryId: number = 0;
  subcategory: Signal<Subcategory | undefined> = computed<Subcategory | undefined>(() => this.subcategoryService.subcategories().find(sub => sub.id == this.subcategoryId));
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());
  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  mappedCategories: PrimeNGObject[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear categoria';

  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  @Output() subcategoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private messageService: MessageService,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateCategoriesError();
    this.validateAction();
  }

  initializeForm() {
    this.subcategoryForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code !== 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  validateAction() {
    this.obtainIdFromPath();
    this.extractMappedCategories();
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

  extractMappedCategories() {
    effect(() => {
      if(this.categories().length == 0) return;
      this.mappedCategories = this.categories().map(cat => ({ value: `${cat.id}`, name: cat.name }))
      this.isLoading = this.buttonLabel === 'Guardar' && !this.subcategory();
    }, {injector: this.injector})
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
    effect(() => {
      if(!this.subcategory()) return;
      this.subcategoryForm.patchValue({
        id: this.subcategoryId,
        name: this.subcategory()?.name,
        categoryId: `${this.subcategory()?.categoryId}`
      })
      this.isLoading = this.mappedCategories.length === 0;
    }, {injector: this.injector})
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
    this.isWorking = true;
    this.subcategoryService.create(this.getObject()).subscribe({
      next: () => {
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.isWorking = false;
        this.router.navigateByUrl('/dashboard/subcategory');
      }
    })
  }

  updateSubcategory() {
    this.isWorking = true;
    this.subcategoryService.update(this.getObject()).subscribe({
      next: () => {
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error) {
          if(error.error.code == 406) {
            this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.isWorking = false;
        this.router.navigateByUrl('/dashboard/subcategory');
      }
    })
  }

  getObject(): Subcategory {
    return {
      id: this.subcategoryId,
      name: this.subcategoryForm.value.name,
      categoryId: this.subcategoryForm.value.categoryId
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
