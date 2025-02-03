import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Category } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { FormErrors } from '@models/security/security-error.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, InputTextComponent, ButtonComponent, InputNumberComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['../../../../../../assets/css/layout.css']
})
export class CategoryFormComponent implements OnInit {

  categoryForm: FormGroup;
  formErrors: FormErrors;

  category: Category = new Category();

  buttonLabel: string = 'Crear';
  title: string = 'Crear tienda';

  @Output() categoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtainIdFromPath();
    this.findCategoryById();
  }

  obtainIdFromPath() {
    this.category.id = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  findCategoryById() {
    if(this.isCreate()) {
      this.prepareCreateForm();
    }
    this.setUpdateTitles();
    this.categoryService.getById(this.category.id).subscribe({
      next: (response) => {
        this.category = response || new Category();
        this.prepareUpdateForm();
      },
      error: (error) => {
        console.log("Ha ocurrido un error al obtener categoria por id. ", error);
      }
    })
  }

  isCreate(): boolean {
    return this.category.id === 0;
  }

  prepareCreateForm() {
    this.categoryForm.patchValue({
      id: this.category.id
    })
  }

  prepareUpdateForm() {
    this.categoryForm.patchValue({
      id: this.category.id,
      name: this.category.name,
      description: this.category.description,
      imageName: this.category.imageName
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tienda';
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageName: ['']
    });
  }

  receiveValueString(key: string, value: string) {
    this.categoryForm.value[key] = value;
  }

  receiveValueNumber(key: string, value: number) {
    this.categoryForm.value[key] = value;
  }

  validateForm() {
    if(!this.categoryForm.valid) {
      this.getFormErrors();
      return;
    }
    this.createCategory();
  }

  getFormErrors() {
    this.formErrors = {};
    Object.keys(this.categoryForm.controls).forEach(key => {
      const controlErrors = this.categoryForm.get(key)?.errors;
      if(!controlErrors) return;
      this.formErrors[key] = [];
      Object.keys(controlErrors).forEach(keyError => this.formErrors[key].push(keyError));
    });
    this.errorEvent();
  }

  errorEvent() { this.categoryErrorEvent.emit(this.formErrors); }

  createCategory() {
    this.getCategoryObject();
    this.categoryService.create(this.category)
  }

  updateCategory() {
    this.getCategoryObject();
    console.log({category: this.category});
  }

  getCategoryObject() {
    this.category = { ...this.categoryForm.value };
  }

}
