import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, ButtonComponent, InputTextComponent, InputNumberComponent, InputSelectComponent],
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css']
})
export class SubcategoryFormComponent {

  subcategoryForm: FormGroup;
  formErrors: FormErrors;

  subcategory: Subcategory = new Subcategory();
  categories: Category[] = [];
  mappedCategories: PrimeNGObject[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear categoria';

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
    this.initializeForm();
    this.obtainIdFromPath();
    this.openSubscriptions();
  }

  obtainIdFromPath() {
    this.subcategory.id = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  findSubcategoryById() {
    if(this.isCreate()) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    if(this.categories.length == 0) return;
    this.subcategoryService.getById(this.subcategory.id).subscribe({
      next: (response) => {
        if(response?.id == null || response.id == undefined) return;
        this.subcategory = response || new Subcategory();
        this.prepareUpdateForm();
      },
      error: (error) => {
        console.log("Ha ocurrido un error al obtener categoria por id. ", error);
      }
    })
  }

  openSubscriptions() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.mapCategoriesToSelect();
        this.findSubcategoryById();
      },
      error: (error) => {
        console.log("Ha ocurrido un error en categories.", error);
      }
    })
  }

  mapCategoriesToSelect() {
    this.mappedCategories = this.categories.map(cat => {
      return { value: `${cat.id}`, name: cat.name }
    })
  }

  isCreate(): boolean {
    return this.subcategory.id === 0;
  }

  prepareCreateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategory.id
    })
  }

  prepareUpdateForm() {
    this.subcategoryForm.patchValue({
      id: this.subcategory.id,
      name: this.subcategory.name,
      categoryId: `${this.subcategory.categoryId}`
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar categoria';
  }

  initializeForm() {
    this.subcategoryForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  receiveValueString(key: string, value: string) {
    this.subcategoryForm.patchValue({ [key]: value })
  }

  receiveValueNumber(key: string, value: number) {
    this.subcategoryForm.patchValue({ [key]: value })
  }

  validateForm() {
    if(!this.subcategoryForm.valid) {
      this.getFormErrors();
      return;
    }
    this.getCategoryObject();
    if(this.buttonLabel === 'Crear') {
      this.createSubcategory();
    }else {
      this.updateSubcategory();
    }
  }

  getFormErrors() {
    this.formErrors = {};
    Object.keys(this.subcategoryForm.controls).forEach(key => {
      const controlErrors = this.subcategoryForm.get(key)?.errors;
      if(!controlErrors) return;
      this.formErrors[key] = [];
      Object.keys(controlErrors).forEach(keyError => this.formErrors[key].push(keyError));
    });
    this.errorEvent();
  }

  errorEvent() { this.subcategoryErrorEvent.emit(this.formErrors); }

  createSubcategory() {
    this.subcategoryService.create(this.subcategory).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  updateSubcategory() {
    this.subcategoryService.update(this.subcategory).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/subcategory');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  getCategoryObject() {
    this.subcategory = { 
      id: this.subcategoryForm.value.id,
      name: this.subcategoryForm.value.name,
      categoryId: this.subcategoryForm.value.categoryId
    };
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
