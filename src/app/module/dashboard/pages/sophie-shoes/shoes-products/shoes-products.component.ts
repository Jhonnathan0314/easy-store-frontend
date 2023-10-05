import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-shoes-products',
  templateUrl: './shoes-products.component.html',
  styleUrls: ['./shoes-products.component.css']
})
export class ShoesProductsComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
  }

}
