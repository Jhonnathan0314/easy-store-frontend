import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataViewComponent } from '@component/shared/data/data-view/data-view.component';
import { Product } from '@models/data/product.model';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, DataViewComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  products: Product[] = [];

  categoryId: number;

  productsSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getIdFromPath();
    this.productsSubscribe();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getIdFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  productsSubscribe() {
    this.productsSubscription = this.productService.getByCategoryId(this.categoryId).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.log("Ha ocurrido un error en productos.", error);
      }
    })
  }

}
