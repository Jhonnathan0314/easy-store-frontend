import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { Product } from '@models/data/product.model';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subcategory } from '@models/data/subcategory.model';
import { Subscription } from 'rxjs';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent],
  templateUrl: './product-all.component.html'
})
export class ProductAllComponent {

  products: Product[] = [];
  mappedProducts: DataObject[] = [];
  
  subcategories: Subcategory[] = [];

  productSubscription: Subscription;
  subcategorySubscription: Subscription;

  constructor(
    private router: Router,
    private productService: ProductService,
    private subcategoryService: SubcategoryService
  ) { }

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openSubscriptions() {
    this.subcategorySubscription = this.subcategoryService.storedSubcategories$.subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
        this.openSubcategorySubscription();
      },
      error: (error) => {
        console.log('Ha ocurrido un error en categorias: ', {error});
      }
    })
  }

  openSubcategorySubscription() {
    if(this.subcategories.length == 0) return;
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        this.products = products;
        this.convertToDataObject();
      },
      error: (error) => {
        console.log('Ha ocurrido un error en subcategorias: ', {error});
      }
    })
  }

  closeSubscriptions() {
    this.productSubscription.unsubscribe();
  }

  convertToDataObject() {
    let subcategory = new Subcategory();
    this.mappedProducts = this.products.map(prod => {
      subcategory = this.subcategories.find(sub => sub.id == prod.subcategoryId) ?? new Subcategory();
      return {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: prod.quantity,
        qualification: prod.qualification,
        description: prod.description,
        subcategoryId: subcategory.id,
        subcategoryName: subcategory.name,
        categoryId: subcategory.categoryId
      }
    })
  }

  deleteById(product: DataObject) {
    this.productService.deleteById(product?.id ?? 0);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
