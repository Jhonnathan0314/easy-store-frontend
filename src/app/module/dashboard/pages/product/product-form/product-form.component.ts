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
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';

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
  product: Signal<Product | undefined> = computed(() => this.productService.products().find(prod => prod.id == this.productId));
  productImagesFinded: Signal<number[]> = computed(() => this.productService.productImagesFinded());

  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());
  mappedSubcategories: PrimeNGObject[] = [];
  
  files: S3File[] = [];
  filesToUpload: S3File[] = [];
  filesToDelete: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear producto';

  viewInputFile: boolean = true;
  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  subcategorySubscription: Subscription;

  @Output() productErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private injector: Injector,
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
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
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
      this.isLoading = false;
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
      this.mappedSubcategories = this.subcategories().map(sub => ({ value: `${sub.id}`, name: sub.name }));
      this.isLoading = this.buttonLabel === 'Guardar' && !this.product();
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
      if(!this.product()) return;
      if(this.product()?.imageName != 'store.png' && !this.productImagesFinded().includes(this.productId)) {
        this.viewInputFile = false;
      }
      this.productForm.patchValue({
        id: this.productId,
        name: this.product()?.name,
        description: this.product()?.description,
        price: this.product()?.price,
        quantity: this.product()?.quantity,
        qualification: this.product()?.qualification,
        subcategoryId: `${this.product()?.subcategoryId}`
      })
      this.isLoading = this.mappedSubcategories.length === 0;
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
    this.isWorking = true;
    this.productService.create(this.getObject(), this.filesToUpload).subscribe({
      next: (product) => {
        this.productService.findProductImages(product.id).subscribe();
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.isWorking = false;
        this.router.navigateByUrl('/dashboard/product');
      }
    })
  }

  updateProduct() {
    this.isWorking = true;
    this.productService.update(this.getObject(), this.filesToUpload, this.filesToDelete).subscribe({
      next: () => {
      },
      error: (error) => {
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.error.detail});
      },
      complete: () => {
        this.productService.findProductImages(this.productId).subscribe();
        this.isWorking = false;
        this.router.navigateByUrl('/dashboard/product');
      }
    })
  }

  getObject(): Product {
    return { 
      ...this.productForm.value,
      imageNumber: this.product()?.imageNumber ?? 0,
      imageLastNumber: this.product()?.imageLastNumber ?? 0,
      imageName: this.product()?.imageName ?? 'product.png'
    };
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
    this.isWorking = true;
    if(!this.productImagesFinded().includes(this.productId)) {
      this.productService.findProductImages(this.productId).subscribe({
        complete: () => {
          this.viewInputFile = value;
          this.isWorking = false;
        }
      });
    }else {
      this.viewInputFile = value;
      this.isWorking = false;
    }
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
