import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchProductsComponent } from './launch-products/launch-products.component';
import { LaunchCreateProductComponent } from './launch-create-product/launch-create-product.component';
import { LaunchUpdateProductComponent } from './launch-update-product/launch-update-product.component';
import { LaunchCartComponent } from './launch-cart/launch-cart.component';

const routes: Routes = [
  { path: '', component: LaunchProductsComponent },
  { path: 'create', component: LaunchCreateProductComponent },
  { path: 'update', component: LaunchUpdateProductComponent },
  { path: 'cart', component: LaunchCartComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SophieLaunchRoutingModule { }
