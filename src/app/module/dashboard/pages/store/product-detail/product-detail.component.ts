import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '@models/data/product.model';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { S3File } from '@models/utils/file.model';
import { Purchase } from '@models/data/purchase.model';
import { environment } from 'src/environments/environment';
import { cartHasProduct } from 'src/app/core/utils/validation/cart-validation.util';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, ImagePipe, GalleriaModule, ButtonComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['../../../../../../../public/assets/css/layout.css']
})
export class ProductDetailComponent {

  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() removeFromCartEvent = new EventEmitter<Product>();
  @Output() goCartEvent = new EventEmitter<Product>();
  @Output() goBackCartEvent = new EventEmitter<void>();

  @Input() cart: Purchase = new Purchase();
  @Input() product: Product | undefined = undefined;
  @Input() disableButtons: boolean = false;

  PRODUCT_IMAGE_NAME: string = environment.DEFAULT_IMAGE_PRODUCT_NAME;

  defaultImages: {src: string}[] = [
    {
      src: `/assets/img/${this.PRODUCT_IMAGE_NAME}`
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
    return cartHasProduct(this.cart, product!);
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
    if(product == undefined) return;
    window.open(`https://wa.me/+573202778890?text=Hola!%20%0A%0AVi%20el%20producto%20${product.name}%2E%20%0A%0AQuiero%20realizar%20la%20compra%2E%20%28id%20${product.id}%29`)
  }

  goBackStore() {
    this.goBackCartEvent.emit();
  }

}
