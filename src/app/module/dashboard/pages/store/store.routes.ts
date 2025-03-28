import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: 'products/:_id', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: 'cart', pathMatch: 'full' }
];