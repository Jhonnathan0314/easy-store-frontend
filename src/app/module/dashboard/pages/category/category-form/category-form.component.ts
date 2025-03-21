import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { FormErrors } from '@models/security/security-error.model';
import { InputFileComponent } from '@component/shared/inputs/input-file/input-file.component';
import { S3File } from '@models/utils/file.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, InputTextComponent, ButtonComponent, InputNumberComponent, InputFileComponent, ToastModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class CategoryFormComponent implements OnInit {

  categoryForm: FormGroup;
  formErrors: FormErrors;

  category: Category = new Category();

  filesToUpload: S3File[] = [];
  filesUploaded: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear tienda';

  viewInputFile: boolean = true;

  @Output() categoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateAction()
  }

  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  validateAction() {
    this.obtainIdFromPath();
    if(this.category.id == 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.findCategoryById();
  }

  obtainIdFromPath() {
    this.category.id = parseInt(this.activatedRoute.snapshot.params['_id']) ?? 0;
  }

  prepareCreateForm() {
    this.categoryForm.patchValue({
      id: this.category.id
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tienda';
  }

  findCategoryById() {
    this.categoryService.getById(this.category.id).subscribe({
      next: (response) => {
        if(response) {
          this.category = response || new Category();
          this.prepareUpdateForm();
        }
      },
      error: (error) => {
        console.log("Ha ocurrido un error al obtener categoria por id. ", error);
      }
    })
  }

  prepareUpdateForm() {
    if(this.category.imageName != 'store.png') {
      this.viewInputFile = false;
    }
    this.categoryForm.patchValue({
      id: this.category.id,
      name: this.category.name,
      description: this.category.description
    });
  }

  validateForm() {
    if(!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.prepareRequest();
  }

  prepareRequest() {
    this.category = { 
      ...this.categoryForm.value, 
      imageName: this.category.imageName ?? 'store.png' 
    };
    this.executeAction();
  }

  executeAction() {
    if(this.category.id == 0) {
      this.createCategory();
      return;
    }
    this.updateCategory();
  }

  createCategory() {
    this.categoryService.create(this.category, this.filesToUpload[0] ?? null).subscribe({
      next: () => { },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/category');
      }
    })
  }

  updateCategory() {
    this.categoryService.update(this.category, this.filesToUpload[0] ?? null).subscribe({
      next: () => { },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/category');
      }
    })
  }

  uploadFiles(files: S3File[]) {
    this.filesToUpload = files;
  }

  receiveValue(key: string, value: string | number) {
    this.categoryForm.patchValue({ [key]: value });
  }

  setViewInputFile(value: boolean) {
    this.viewInputFile = value;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
