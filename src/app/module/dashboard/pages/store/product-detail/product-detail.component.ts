import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@models/data/product.model';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { PurchaseCart } from '@models/data/purchase.model';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { S3File } from '@models/utils/file.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, GalleriaModule, ButtonComponent],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {

  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() removeFromCartEvent = new EventEmitter<Product>();
  @Output() buyNowEvent = new EventEmitter<Product>();
  @Output() goCartEvent = new EventEmitter<Product>();
  @Output() goBackCartEvent = new EventEmitter<void>();

  @Input() cart: PurchaseCart = new PurchaseCart();
  @Input() product: Product | undefined = undefined;

  defaultImages: {src: string}[] = [
    {
      src: '/assets/img/product.png'
    }
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsiveOptions: any[] = [
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
  ];

  constructor() {}
  
  onImagesChange(event: S3File[]): void {
    if (this.product) {
      this.product.images = event;
    }
  }

  cartHasProduct(product: Product | undefined) {
    return this.cart.products.find(p => p.id.productId == product?.id) != undefined;
  }

  addToCart(product: Product | undefined) {
    this.addToCartEvent.emit(product);
  }

  removeFromCart(product: Product | undefined) {
    this.removeFromCartEvent.emit(product);
  }

  goToCart() {
    this.goCartEvent.emit();
  }

  buyNow(product: Product | undefined) {
    this.buyNowEvent.emit(product);
  }

  goBackStore() {
    this.goBackCartEvent.emit();
  }

}
