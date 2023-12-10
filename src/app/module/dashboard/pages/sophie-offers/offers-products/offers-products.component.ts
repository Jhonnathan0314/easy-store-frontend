import { Component } from '@angular/core';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-offers-products',
  templateUrl: './offers-products.component.html',
  styleUrls: ['./offers-products.component.css']
})
export class OffersProductsComponent {

  products: Product[] = [];

}
