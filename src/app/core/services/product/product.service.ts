import { Injectable } from '@angular/core';
import { Product } from '../../models/data-types/primeng-object.model';
import productsJson from '../../../../assets/data/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products: Product[] = [];

  constructor() {
    this.products = productsJson;
  }

  getAllProducts() {
    return this.products;
  }

}
