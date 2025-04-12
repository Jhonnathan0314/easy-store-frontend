import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Product } from '@models/data/product.model';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subcategory } from '@models/data/subcategory.model';
import { Subscription } from 'rxjs';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { ProductTableComponent } from "../product-table/product-table.component";

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [MessageModule, ButtonComponent, LoadingTableComponent, ProductTableComponent],
  templateUrl: './product-all.component.html'
})
export class ProductAllComponent implements OnInit {

  productsError: Signal<ErrorMessage | null> = computed(() => this.productService.productsError());
  products: Signal<Product[]> = computed(() => this.productService.products());
  mappedProducts: Product[] = [];
  
  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());

  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  productSubscription: Subscription;
  subcategorySubscription: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
          ...prod,
          subcategory: subcategory,
          categoryId: subcategory.categoryId
        }
      })
      this.isLoading = false;
      if(this.isWorking) this.isWorking = false;
      console.log({products: this.products(), mapped: this.mappedProducts});
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

  goUpdate(product: Product) {
    this.router.navigateByUrl(`/dashboard/product/form/${product.id}`);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
