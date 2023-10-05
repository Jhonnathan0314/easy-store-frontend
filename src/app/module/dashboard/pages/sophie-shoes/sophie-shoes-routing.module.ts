import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoesProductsComponent } from './shoes-products/shoes-products.component';
import { ShoesCreateProductComponent } from './shoes-create-product/shoes-create-product.component';
import { ShoesUpdateProductComponent } from './shoes-update-product/shoes-update-product.component';
import { ShoesCartComponent } from './shoes-cart/shoes-cart.component';

const routes: Routes = [
  { path: '', component: ShoesProductsComponent },
  { path: 'create', component: ShoesCreateProductComponent },
  { path: 'update', component: ShoesUpdateProductComponent },
  { path: 'cart', component: ShoesCartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SophieShoesRoutingModule { }
