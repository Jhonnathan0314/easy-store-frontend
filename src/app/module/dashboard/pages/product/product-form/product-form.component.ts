import { Component, computed, EventEmitter, OnInit, Output, Signal } from '@angular/core';
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

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, ButtonComponent, InputNumberComponent, InputTextComponent, InputSelectComponent, InputFileComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class ProductFormComponent implements OnInit {

  productForm: FormGroup;
  formErrors: FormErrors;

  product: Product = new Product();

  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());
  mappedSubcategories: Signal<PrimeNGObject[]> = computed<PrimeNGObject[]>(() => this.subcategories().map(sub => ({ value: `${sub.id}`, name: sub.name })));
  
  files: S3File[] = [];
  filesToUpload: S3File[] = [];
  filesToDelete: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear producto';

  viewInputFile: boolean = true;
  isLoading: boolean = true;

  subcategorySubscription: Subscription;

  @Output() productErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.validateAction();
  }

  initializeForm() {
    this.productForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      qualification: [null, [Validators.required]],
      subcategoryId: [null, [Validators.required]]
    });
  }

  validateAction() {
    this.obtainIdFromPath();
    if(this.product.id == 0) {
      this.prepareCreateForm();
      this.isLoading = false;
      return;
    }
    this.setUpdateTitles();
    this.findProductById();
  }

  obtainIdFromPath() {
    this.product.id = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  prepareCreateForm() {
    this.productForm.patchValue({
      id: this.product.id
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar producto';
  }

  findProductById() {
    this.isLoading = true;
    if(this.subcategories().length == 0) return;
    this.productService.getById(this.product.id).subscribe({
      next: (response) => {
        if(response?.id == null || response.id == undefined) return;
        this.product = response || new Subcategory();
        this.files = this.product.images;
        this.prepareUpdateForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  prepareUpdateForm() {
    if(this.product.imageName != 'store.png') {
      this.viewInputFile = false;
    }
    this.productForm.patchValue({
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      quantity: this.product.quantity,
      qualification: this.product.qualification,
      subcategoryId: `${this.product.subcategoryId}`
    })
  }

  validateForm() {
    if(!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.prepareRequest();
  }

  prepareRequest() {
    this.product = { 
      ...this.productForm.value,
      imageNumber: this.product.imageNumber ?? 0,
      imageLastNumber: this.product.imageLastNumber ?? 0,
      imageName: this.product.imageName ?? 'product.png'
    };
    this.executeAction();
  }

  executeAction() {
    if(this.product.id == 0) {
      this.createProduct();
      return;
    }
    this.updateProduct();
  }

  createProduct() {
    this.productService.create(this.product, this.filesToUpload).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.productService.findProductImages(this.product.id).subscribe();
        this.router.navigateByUrl('/dashboard/product');
      }
    })
  }

  updateProduct() {
    this.productService.update(this.product, this.filesToUpload, this.filesToDelete).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      },
      complete: () => {
        this.productService.findProductImages(this.product.id).subscribe();
        this.router.navigateByUrl('/dashboard/product');
      }
    })
  }

  deleteFile(file: S3File) {
    this.product.images = this.product.images.filter(img => img.name != file.name);
    this.filesToDelete.push(file);
  }

  uploadFiles(files: S3File[]) {
    this.filesToUpload = files;
  }

  receiveValue(key: string, value: string | number) {
    this.productForm.patchValue({ [key]: value });
  }

  setViewInputFile(value: boolean) {
    this.viewInputFile = value;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
