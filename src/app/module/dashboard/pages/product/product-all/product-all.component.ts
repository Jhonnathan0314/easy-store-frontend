import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { Product } from '@models/data/product.model';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subcategory } from '@models/data/subcategory.model';
import { Subscription } from 'rxjs';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { Router } from '@angular/router';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [MessageModule, ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './product-all.component.html'
})
export class ProductAllComponent implements OnInit {

  productsError: Signal<ErrorMessage | null> = computed(() => this.productService.productsError());
  products: Signal<Product[]> = computed(() => this.productService.products());
  mappedProducts: DataObject[] = [];
  
  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());

  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  productSubscription: Subscription;
  subcategorySubscription: Subscription;

  constructor(
    private router: Router,
    private injector: Injector,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.extractMappedProducts();
    this.validateProductsError();
    this.validateSubcategoriesError();
  }

  extractMappedProducts() {
    effect(() => {
      this.mappedProducts = this.products().map(prod => {
        const subcategory = this.subcategories().find(sub => sub.id == prod.subcategoryId) ?? new Subcategory();
        return {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: prod.quantity,
          qualification: prod.qualification,
          description: prod.description,
          imageName: prod.imageName,
          imageObj: prod.imageNumber > 0 && prod.images && prod.images.length > 0 ? prod.images[0] : undefined,
          subcategoryId: subcategory.id,
          subcategoryName: subcategory.name,
          categoryId: subcategory.categoryId
        }
      })
      this.isLoading = false;
      if(this.isWorking) this.isWorking = false;
    }, {injector: this.injector})
  }

  validateProductsError() {
    effect(() => {
      if(this.productsError() == null) return;
      if(this.productsError()?.code !== 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  validateSubcategoriesError() {
    effect(() => {
      if(this.subcategoriesError() == null) return;
      if(this.subcategoriesError()?.code !== 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  deleteById(product: DataObject) {
    this.isWorking = true;
    this.productService.deleteById(product?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/product/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
