import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SophieShoesRoutingModule } from './sophie-shoes-routing.module';
import { ShoesProductsComponent } from './shoes-products/shoes-products.component';
import { ShoesCreateProductComponent } from './shoes-create-product/shoes-create-product.component';
import { ShoesUpdateProductComponent } from './shoes-update-product/shoes-update-product.component';
import { ShoesCartComponent } from './shoes-cart/shoes-cart.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ShoesProductsComponent,
    ShoesCreateProductComponent,
    ShoesUpdateProductComponent,
    ShoesCartComponent
  ],
  imports: [
    CommonModule,
    SophieShoesRoutingModule,
    SharedModule
  ]
})
export class SophieShoesModule { }
