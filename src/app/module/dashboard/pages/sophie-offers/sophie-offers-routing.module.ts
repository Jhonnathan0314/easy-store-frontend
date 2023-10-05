import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersProductsComponent } from './offers-products/offers-products.component';
import { OffersCreateProductComponent } from './offers-create-product/offers-create-product.component';
import { OffersUpdateProductComponent } from './offers-update-product/offers-update-product.component';
import { OffersCartComponent } from './offers-cart/offers-cart.component';

const routes: Routes = [
  { path: '', component: OffersProductsComponent },
  { path: 'create', component: OffersCreateProductComponent },
  { path: 'update', component: OffersUpdateProductComponent },
  { path: 'cart', component: OffersCartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SophieOffersRoutingModule { }
