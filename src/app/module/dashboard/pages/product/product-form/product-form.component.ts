import { Component, computed, effect, EventEmitter, Injector, OnInit, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '@models/data/product.model';
import { Subcategory } from '@models/data/subcategory.model';
import { FormErrors } from '@models/security/security-error.model';
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { InputNumberComponent } from "../../../../../shared/inputs/input-number/input-number.component";
import { InputTextComponent } from "../../../../../shared/inputs/input-text/input-text.component";
import { InputSelectComponent } from "../../../../../shared/inputs/input-select/input-select.component";
import { InputFileComponent } from "../../../../../shared/inputs/input-file/input-file.component";
import { S3File } from '@models/utils/file.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoadingFormComponent } from "../../../../../shared/skeleton/loading-form/loading-form.component";
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { environment } from 'src/environments/environment';
import { convertListToDataObjects } from 'src/app/core/utils/mapper/primeng-mapper.util';
import { REGEX_TEXT_DEFAULT } from 'src/app/core/utils/constants/regex.contants';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, MessageModule, ButtonComponent, InputNumberComponent, InputTextComponent, InputSelectComponent, InputFileComponent, LoadingFormComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  formErrors: FormErrors;

  productId: number = 0;
  product: Product | undefined = undefined;

  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());
  mappedSubcategories: PrimeNGObject[] = [];
  
  files: S3File[] = [];
  filesToUpload: S3File[] = [];
  filesToDelete: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear producto';

  viewInputFile: boolean = true;
  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;

  subcategorySubscription: Subscription;

  @Output() productErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateSubcategoriesError();
    this.validateAction();
  }

  initializeForm() {
    this.productForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required, Validators.pattern(REGEX_TEXT_DEFAULT)]],
      description: ['', [Validators.required, Validators.pattern(REGEX_TEXT_DEFAULT)]],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      qualification: [null, [Validators.required, Validators.min(0), Validators.max(5)]],
      subcategoryId: [null, [Validators.required]]
    });
  }

  validateSubcategoriesError() {
    effect(() => {
      if(this.subcategoriesError() == null) return;
      if(this.subcategoriesError()?.code !== 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  validateAction() {
    this.obtainIdFromPath();
    this.extractMappedSubcategories();
    if(this.productId == 0) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    this.prepareUpdateForm();
  }

  obtainIdFromPath() {
    this.productId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  extractMappedSubcategories() {
    effect(() => {
      if(this.subcategories().length === 0) return;
      this.mappedSubcategories = convertListToDataObjects(this.subcategories());
    }, {injector: this.injector})
  }

  prepareCreateForm() {
    this.productForm.patchValue({
      id: this.productId
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar producto';
  }

  prepareUpdateForm() {
    effect(() => {
      this.product = this.productService.getById(this.productId)();
      if(!this.product) return;
      if(this.product?.imageName != environment.DEFAULT_IMAGE_CATEGORY_NAME && this.product.images) {
        if(this.product?.imageNumber !== this.product?.images.length) this.viewInputFile = false;
      }
      this.productForm.patchValue({
        id: this.productId,
        name: this.product?.name,
        description: this.product?.description,
        price: this.product?.price,
        quantity: this.product?.quantity,
        qualification: this.product?.qualification,
        subcategoryId: `${this.product?.subcategoryId}`
      })
    }, {injector: this.injector})
  }

  validateForm() {
    if(!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if(this.productId == 0) {
      this.createProduct();
      return;
    }
    this.updateProduct();
  }

  createProduct() {
    this.productService.create(this.getObject()).subscribe({
      next: (product: Product) => {
        this.productId = product.id;
        this.validateProductFiles();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code === 400) this.validateProductFiles();
        else this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.detail});
      }
    })
  }

  updateProduct() {
    this.productService.update(this.getObject()).subscribe({
      next: () => {
        this.validateProductFiles();
      },
      error: (error) => {
        if(error.error.code === 400) this.validateProductFiles();
        else this.messageService.add({severity: 'error', summary: 'Error', detail: error.error.detail});
      }
    })
  }

  validateProductFiles() {
    if(this.filesToDelete.length > 0) this.deleteProductFiles();
    else if(this.filesToUpload.length > 0) this.uploadProductFiles();
    else this.router.navigateByUrl('/dashboard/product');
  }

  deleteProductFiles() {
    this.productService.deleteProductFiles(this.productId, this.filesToDelete).subscribe({
      next: () => {
        if(this.filesToUpload.length > 0) this.uploadProductFiles();
        else this.router.navigateByUrl('/dashboard/product');
      },
      error: (error) => {
        this.handleUpdateError(error);
      }
    });
  }

  uploadProductFiles() {
    this.productService.uploadProductFiles(this.productId, this.filesToUpload).subscribe({
      error: (error) => {
        this.handleUpdateError(error);
      },
      complete: () => this.router.navigateByUrl('/dashboard/product')
    });
  }

  getObject(): Product {
    return { 
      ...this.productForm.value,
      imageNumber: this.product?.imageNumber ?? 0,
      imageLastNumber: this.product?.imageLastNumber ?? 0,
      imageName: this.product?.imageName ?? environment.DEFAULT_IMAGE_PRODUCT_NAME
    };
  }

  handleUpdateError(error: ApiResponse<ErrorMessage>) {
    if(error.error) {
      if(error.error.code == 406 || error.error.code == 409) {
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
        return;
      }
    }
    this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
  }

  deleteFile(file: S3File) {
    this.filesToDelete.push(file);
  }

  uploadFiles(files: S3File[]) {
    this.filesToUpload = files;
  }

  receiveValue(key: string, value: string | number) {
    this.productForm.patchValue({ [key]: value });
  }

  setViewInputFile(value: boolean) {
    if(this.product?.imageNumber !== this.product?.images.length) {
      this.productService.findById(this.productId).subscribe({
        complete: () => {
          this.viewInputFile = value;
        }
      });
    }else {
      this.viewInputFile = value;
    }
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
