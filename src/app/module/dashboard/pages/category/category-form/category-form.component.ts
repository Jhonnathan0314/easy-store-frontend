import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Category } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { FormErrors } from '@models/security/security-error.model';
import { SessionService } from 'src/app/core/services/session/session.service';
import { InputFileComponent } from '@component/shared/inputs/input-file/input-file.component';
import { S3File } from '@models/utils/file.model';
import { FileService } from 'src/app/core/services/api/utils/file/file.service';
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
    private categoryService: CategoryService,
    private sessionService: SessionService,
    private fileService: FileService
  ) { }

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
      return;
    }
    this.setUpdateTitles();
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

  isCreate(): boolean {
    return this.category.id === 0;
  }

  prepareCreateForm() {
    this.categoryForm.patchValue({
      id: this.category.id
    })
  }

  prepareUpdateForm() {
    if(this.category.imageName != 'store.png') {
      this.viewInputFile = false;
    }
    this.categoryForm.patchValue({
      id: this.category.id,
      name: this.category.name,
      description: this.category.description,
      imageName: this.category.imageName
    });
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
    this.getCategoryObject();
    if(this.buttonLabel === 'Crear') {
      this.createCategory();
    }else {
      this.updateCategory(true);
    }
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
    this.categoryService.create(this.category).subscribe({
      next: (response) => {
        if(this.filesToUpload.length > 0) {
          this.category.id = response.data.id;
          this.uploadFiles(this.filesToUpload);
        }
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  updateCategory(redirect: boolean) {
    this.categoryService.update(this.category).subscribe({
      next: (response) => {
        if(redirect)
          this.router.navigateByUrl('/dashboard/category');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear la categoria.", error);
      }
    })
  }

  getCategoryObject() {
    this.category = { ...this.categoryForm.value };
    this.category.userId = this.sessionService.getUserId();
    this.category.accountId = this.sessionService.getAccountId();
    this.category.imageName = this.filesToUpload.length > 0 ? this.filesToUpload[0].name : 'store.png';
  }

  uploadFiles(files: S3File[]) {
    if(this.category.id == 0) {
      this.filesToUpload = files;
      this.messageService.add({severity: 'info', summary: `Información.`, detail: `Las imagenes serán cargadas automaticamente cuando cree la tienda.`});
      return;
    }
    files.forEach(file  => {
      file.context = "category";
      file.name = `${this.category.id}.png`;
      this.category.imageName = file.name;
      this.fileService.putFile(file).subscribe({
        next: (response) => {
          if(response) {
            this.filesUploaded.push(file);
            this.messageService.add({severity: 'success', summary: `Cargue exitoso.`, detail: `Imagen ${file.name} cargada con éxito.`});
            this.updateCategory(true);
          }
        },
        error: (error) => {
          console.log("Ha ocurrido un error al cargar el archivo ", {name: file.name, error});
        }
      })
    })
    this.filesToUpload = [];
  }

  setViewInputFile(value: boolean) {
    this.viewInputFile = value;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
