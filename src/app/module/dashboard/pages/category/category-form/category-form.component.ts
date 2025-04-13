import { Component, computed, effect, EventEmitter, Injector, OnInit, Output, Signal } from '@angular/core';
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
import { LoadingFormComponent } from "../../../../../shared/skeleton/loading-form/loading-form.component";
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, InputTextComponent, ButtonComponent, InputNumberComponent, InputFileComponent, ToastModule, LoadingFormComponent],
  templateUrl: './category-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class CategoryFormComponent implements OnInit {

  categoryForm: FormGroup;
  formErrors: FormErrors;

  categoryId: number = 0;
  category: Category | undefined = undefined;

  filesToUpload: S3File[] = [];
  filesUploaded: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear tienda';

  viewInputFile: boolean = true;
  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);

  @Output() categoryErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateAction();
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
    this.prepareUpdateForm();
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
    effect(() => {
      this.category = this.categoryService.getById(this.categoryId)();
      if(!this.category) return;
      if(this.category?.imageName != environment.DEFAULT_IMAGE_CATEGORY_NAME) {
        this.viewInputFile = false;
      }
      this.categoryForm.patchValue({
        id: this.categoryId,
        name: this.category?.name,
        description: this.category?.description
      });
    }, {injector: this.injector})
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
    this.categoryService.create(this.getCreateObject(), this.filesToUpload[0] ?? null).subscribe({
      next: (category) => {
        this.router.navigateByUrl(`/dashboard/payment-type/form/category/${category.id}/payment-type/0`);
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        this.handleCreateError(error);
      }
    })
  }

  getCreateObject(): Category {
    return {
      id: this.categoryId,
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description,
      imageName: environment.DEFAULT_IMAGE_CATEGORY_NAME,
      userId: 0,
      accountId: 0,
      image: new S3File()
    }
  }

  handleCreateError(error: ApiResponse<ErrorMessage>) {
    if(error.error){
      if(error.error.code == 409) {
        this.messageService.add({severity: 'error', summary: error.error.detail, detail: 'Ya existe una tienda con el mismo nombre.'});
        return;
      }
    }
    this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
  }

  updateCategory() {
    this.categoryService.update(this.getUpdateObject(), this.filesToUpload[0] ?? null).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.handleUpdateError(error);
      },
      complete: () => {
        this.router.navigateByUrl('/dashboard/category');
      }
    })
  }

  getUpdateObject(): Category {
    return {
      id: this.categoryId,
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description,
      imageName: this.category?.imageName ?? environment.DEFAULT_IMAGE_CATEGORY_NAME,
      userId: 0,
      accountId: 0,
      image: this.category?.image ?? new S3File()
    }
  }

  handleUpdateError(error: ApiResponse<ErrorMessage>) {
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
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
