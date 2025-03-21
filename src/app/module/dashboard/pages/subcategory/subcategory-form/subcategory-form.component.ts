import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ButtonComponent, InputTextComponent, InputNumberComponent, InputSelectComponent],
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css']
})
export class SubcategoryFormComponent implements OnInit, OnDestroy {

  subcategoryForm: FormGroup;
  formErrors: FormErrors;

  subcategory: Subcategory = new Subcategory();
  categories: Category[] = [];
  mappedCategories: PrimeNGObject[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear categoria';

  isLoading: boolean = true;

  categorySubscription: Subscription;

  @Output() subcategoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.openCategorySubscription();
    this.initializeForm();
    this.validateAction();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  closeSubscriptions() {
    if(this.categorySubscription)
      this.categorySubscription.unsubscribe();
  }

  openCategorySubscription() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.mapCategoriesToSelect();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        console.log("Ha ocurrido un error al obtener las categorias.", error);
        if(error.error.code == 404) {
          this.categories = [];
        }
        this.isLoading = false;
      }
    })
  }

  mapCategoriesToSelect() {
    this.mappedCategories = this.categories.map(cat => {
      return { value: `${cat.id}`, name: cat.name }
    })
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
    if(this.subcategory.id == 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.findSubcategoryById();
  }

  obtainIdFromPath() {
    this.subcategory.id = parseInt(this.activatedRoute.snapshot.params['_id'] ?? 0);
  }

  prepareCreateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategory.id
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar categoria';
  }

  findSubcategoryById() {
    this.isLoading = true;
    this.subcategoryService.getById(this.subcategory.id).subscribe({
      next: (response) => {
        if(response?.id == null || response.id == undefined) return;
        this.subcategory = response || new Subcategory();
        this.prepareUpdateForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  prepareUpdateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategory.id,
      name: this.subcategory.name,
      categoryId: `${this.subcategory.categoryId}`
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
    this.getCategoryObject();
    if(this.buttonLabel === 'Crear') {
      this.createSubcategory();
    }else {
      this.updateSubcategory();
    }
  }

  getCategoryObject() {
    this.subcategory = { 
      id: this.subcategoryForm.value.id,
      name: this.subcategoryForm.value.name,
      categoryId: this.subcategoryForm.value.categoryId
    };
  }

  createSubcategory() {
    this.subcategoryService.create(this.subcategory).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  updateSubcategory() {
    this.subcategoryService.update(this.subcategory).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
