import { Component, computed, Signal } from '@angular/core';
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

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './product-all.component.html'
})
export class ProductAllComponent {

  products: Signal<Product[]> = computed(() => this.productService.products());
  mappedProducts: Signal<DataObject[]> = computed<DataObject[]>(() => this.products().map(prod => {
    const subcategory = this.subcategories().find(sub => sub.id == prod.subcategoryId) ?? new Subcategory();
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
  }));
  
  subcategories: Signal<Subcategory[]> = computed(() => this.subcategoryService.subcategories());

  isLoading = true;

  productSubscription: Subscription;
  subcategorySubscription: Subscription;

  constructor(
    private router: Router,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

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
