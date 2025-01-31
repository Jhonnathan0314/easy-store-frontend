import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'create', component: CreateProductComponent },
  { path: 'update', component: UpdateProductComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];