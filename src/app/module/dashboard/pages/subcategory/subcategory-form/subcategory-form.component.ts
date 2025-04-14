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
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { convertListToDataObjects } from 'src/app/core/utils/mapper/primeng-mapper.util';

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
  subcategory: Subcategory | undefined = undefined;
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());
  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  mappedCategories: PrimeNGObject[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear categoria';

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;

  @Output() subcategoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
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
      name: ['', [Validators.required, Validators.minLength(3)]],
      categoryId: [null, [Validators.required]]
    });
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code !== 404) this.hasUnexpectedError = true;
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
      this.mappedCategories = convertListToDataObjects(this.categories());
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
      this.subcategory = this.subcategoryService.getById(this.subcategoryId)();
      if(!this.subcategory) return;
      this.subcategoryForm.patchValue({
        id: this.subcategoryId,
        name: this.subcategory?.name,
        categoryId: `${this.subcategory?.categoryId}`
      })
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
    this.subcategoryService.create(this.getObject()).subscribe({
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/subcategory');
      }
    })
  }

  updateSubcategory() {
    this.subcategoryService.update(this.getObject()).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.handleUpdateError(error);
      },
      complete: () => {
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

  handleUpdateError(error: ApiResponse<ErrorMessage>) {
    if(error.error) {
      if(error.error.code == 406) {
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
        return;
      }
    }
    this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  isFormBlocked() {
    return (!this.isLoading() && this.categories().length == 0) || this.isLoading() || this.hasUnexpectedError || this.isWorking();
  }

}
