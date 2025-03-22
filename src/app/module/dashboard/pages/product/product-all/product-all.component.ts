import { Component, computed, OnInit, Signal } from '@angular/core';
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
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './product-all.component.html'
})
export class ProductAllComponent implements OnInit {

  products: Product[] = [];
  mappedProducts: DataObject[] = [];
  
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());

  isLoading = true;

  productSubscription: Subscription;
  subcategorySubscription: Subscription;

  constructor(
    private router: Router,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.openProductSubscription();
  }

  openProductSubscription() {
    if(this.subcategories.length == 0) return;
    this.productService.findByAccount();
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        if(products.length == 0) return;
        this.products = products;
        this.convertToDataObject();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) this.products = [];
        this.isLoading = false;
      }
    })
  }

  closeSubscriptions() {
    if(this.productSubscription)
      this.productSubscription.unsubscribe();
  }

  convertToDataObject() {
    let subcategory = new Subcategory();
    this.mappedProducts = this.products.map(prod => {
      subcategory = this.subcategories().find(sub => sub.id == prod.subcategoryId) ?? new Subcategory();
      return {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: prod.quantity,
        qualification: prod.qualification,
        description: prod.description,
        imageName: prod.imageName,
        imageObj: prod.imageNumber > 0 && prod.images ? prod.images[0] : undefined,
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name,
        categoryId: subcategory.categoryId
      }
    })
  }

  deleteById(product: DataObject) {
    this.productService.deleteById(product?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/product/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
