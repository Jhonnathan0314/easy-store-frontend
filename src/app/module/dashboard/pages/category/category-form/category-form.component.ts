import { Component, computed, EventEmitter, OnInit, Output, Signal } from '@angular/core';
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
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

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

  categoryId: number = 0;
  category: Signal<Category | undefined> = computed(() => this.categoryService.categories().find(cat => cat.id === this.categoryId));

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
    if(this.categoryId == 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
  }

  obtainIdFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_id']) ?? 0;
  }

  prepareCreateForm() {
    this.categoryForm.patchValue({
      id: this.categoryId
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar tienda';
  }

  prepareUpdateForm() {
    if(this.category()?.imageName != 'store.png') {
      this.viewInputFile = false;
    }
    this.categoryForm.patchValue({
      id: this.categoryId,
      name: this.category.name,
      description: this.category()?.description
    });
  }

  validateForm() {
    if(!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.executeAction();
  }

  executeAction() {
    if(this.categoryId == 0) {
      this.createCategory();
      return;
    }
    this.updateCategory();
  }

  createCategory() {
    if(!this.category()) return;
    this.categoryService.create(this.category() ?? new Category(), this.filesToUpload[0] ?? null).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/category');
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 409) {
            this.messageService.add({severity: 'error', summary: error.error.detail, detail: 'Ya existe una tienda con el mismo nombre.'});
            return;
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      }
    })
  }

  updateCategory() {
    if(!this.category()) return;
    this.categoryService.update(this.category() ?? new Category(), this.filesToUpload[0] ?? null).subscribe({
      next: () => {
        this.router.navigateByUrl('/dashboard/category');
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error){
          if(error.error.code == 406 && this.filesToUpload.length == 0) {
            this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
          }else if (this.filesToUpload.length > 0){
            this.router.navigateByUrl('/dashboard/category');
          }
          return;
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
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
