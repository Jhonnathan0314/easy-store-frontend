import { Component, EventEmitter, Output } from '@angular/core';
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
import { FileService } from 'src/app/core/services/api/utils/file/file.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ButtonComponent, InputNumberComponent, InputTextComponent, InputSelectComponent, InputFileComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css'],
  providers: [MessageService]
})
export class ProductFormComponent {

  productForm: FormGroup;
  formErrors: FormErrors;

  product: Product = new Product();
  subcategories: Subcategory[] = [];
  mappedSubcategories: PrimeNGObject[] = [];
  
  filesToUpload: S3File[] = [];
  filesUploaded: S3File[] = [];

  buttonLabel: string = 'Crear';
  title: string = 'Crear producto';

  viewInputFile: boolean = true;

  subcategorySubscription: Subscription;

  @Output() productErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private productService: ProductService,
    private subcategoryService: SubcategoryService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.obtainIdFromPath();
    this.openSubscriptions();
  }

  obtainIdFromPath() {
    this.product.id = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  findProductById() {
    if(this.isCreate()) {
      this.prepareCreateForm();
      return;
    }
    this.setUpdateTitles();
    if(this.subcategories.length == 0) return;
    this.productService.getById(this.product.id).subscribe({
      next: (response) => {
        if(response?.id == null || response.id == undefined) return;
        this.product = response || new Subcategory();
        this.prepareUpdateForm();
      },
      error: (error) => {
        console.log("Ha ocurrido un error al obtener producto por id. ", error);
      }
    })
  }

  openSubscriptions() {
    this.subcategorySubscription = this.subcategoryService.storedSubcategories$.subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
        this.mapSubcategoriesToSelect();
        this.findProductById();
      },
      error: (error) => {
        console.log("Ha ocurrido un error en subcategorias.", error);
      }
    })
  }

  mapSubcategoriesToSelect() {
    this.mappedSubcategories = this.subcategories.map(cat => {
      return { value: `${cat.id}`, name: cat.name }
    })
  }

  isCreate(): boolean {
    return this.product.id === 0;
  }

  prepareCreateForm() {
    this.productForm.patchValue({
      id: this.product.id,
      name: '',
      description: '',
      price: null,
      quantity: null,
      qualification: null,
      subcategoryId: null,
      imageName: null
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
      subcategoryId: `${this.product.subcategoryId}`,
      imageName: `${this.product.imageName}`
    })
  }

  setUpdateTitles() {
    this.buttonLabel = 'Guardar';
    this.title = 'Actualizar producto';
  }

  initializeForm() {
    this.productForm = this.formBuilder.group({
      id: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      qualification: [null, [Validators.required]],
      subcategoryId: [null, [Validators.required]],
      imageName: ['']
    });
  }

  receiveValueString(key: string, value: string) {
    this.productForm.patchValue({ [key]: value })
  }

  receiveValueNumber(key: string, value: number) {
    this.productForm.patchValue({ [key]: value })
  }

  validateForm() {
    if(!this.productForm.valid) {
      this.getFormErrors();
      return;
    }
    this.getProductObject();
    if(this.buttonLabel === 'Crear') {
      this.createProduct();
    }else {
      this.updateProduct();
    }
  }

  getFormErrors() {
    this.formErrors = {};
    Object.keys(this.productForm.controls).forEach(key => {
      const controlErrors = this.productForm.get(key)?.errors;
      if(!controlErrors) return;
      this.formErrors[key] = [];
      Object.keys(controlErrors).forEach(keyError => this.formErrors[key].push(keyError));
    });
    this.errorEvent();
  }

  errorEvent() { this.productErrorEvent.emit(this.formErrors); }

  createProduct() {
    this.productService.create(this.product).subscribe({
      next: (response) => {
        if(this.filesToUpload.length > 0) {
          this.product.id = response.data.id;
          this.uploadFiles(this.filesToUpload);
        }
      },
      error: (error) => {
        console.log("Ha ocurrido un error al crear el producto.", error);
      }
    })
  }

  updateProduct() {
    this.productService.update(this.product).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/dashboard/product');
      },
      error: (error) => {
        console.log("Ha ocurrido un error al actualizar el producto.", error);
      }
    })
  }

  getProductObject() {
    this.product = { 
      id: this.productForm.value.id,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      price: this.productForm.value.price,
      quantity: this.productForm.value.quantity,
      qualification: this.productForm.value.qualification,
      subcategoryId: this.productForm.value.subcategoryId,
      imageName: this.filesToUpload.length > 0 ? this.filesToUpload[0].name : 'product.png'
    };
  }

  uploadFiles(files: S3File[]) {
    if(this.product.id == 0) {
      this.filesToUpload = files;
      this.messageService.add({severity: 'info', summary: `Información.`, detail: `Las imagenes serán cargadas automaticamente cuando cree el producto.`});
      return;
    }
    files.forEach(file  => {
      file.context = "product";
      file.name = `${this.product.id}.png`;
      this.product.imageName = file.name;
      this.fileService.putFile(file).subscribe({
        next: (response) => {
          if(response) {
            this.filesUploaded.push(file);
            this.messageService.add({severity: 'success', summary: `Cargue exitoso.`, detail: `Imagen ${file.name} cargada con éxito.`});
            // if(this.buttonLabel == 'Crear')
              this.updateProduct();
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
