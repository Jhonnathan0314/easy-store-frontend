import { Component } from '@angular/core';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-offers-products',
  templateUrl: './offers-products.component.html',
  styleUrls: ['./offers-products.component.css']
})
export class OffersProductsComponent {

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
  }


}
