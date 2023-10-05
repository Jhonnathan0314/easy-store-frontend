import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SophieLaunchRoutingModule } from './sophie-launch-routing.module';
import { LaunchProductsComponent } from './launch-products/launch-products.component';
import { LaunchCreateProductComponent } from './launch-create-product/launch-create-product.component';
import { LaunchUpdateProductComponent } from './launch-update-product/launch-update-product.component';
import { LaunchCartComponent } from './launch-cart/launch-cart.component';


@NgModule({
  declarations: [
    LaunchProductsComponent,
    LaunchCreateProductComponent,
    LaunchUpdateProductComponent,
    LaunchCartComponent
  ],
  imports: [
    CommonModule,
    SophieLaunchRoutingModule
  ]
})
export class SophieLaunchModule { }
