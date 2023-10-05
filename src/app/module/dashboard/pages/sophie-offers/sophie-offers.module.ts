import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SophieOffersRoutingModule } from './sophie-offers-routing.module';
import { OffersProductsComponent } from './offers-products/offers-products.component';
import { OffersCreateProductComponent } from './offers-create-product/offers-create-product.component';
import { OffersUpdateProductComponent } from './offers-update-product/offers-update-product.component';
import { OffersCartComponent } from './offers-cart/offers-cart.component';


@NgModule({
  declarations: [
    OffersProductsComponent,
    OffersCreateProductComponent,
    OffersUpdateProductComponent,
    OffersCartComponent
  ],
  imports: [
    CommonModule,
    SophieOffersRoutingModule
  ]
})
export class SophieOffersModule { }
