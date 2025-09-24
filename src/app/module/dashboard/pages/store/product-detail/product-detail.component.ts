import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { Product } from '@models/data/product.model';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { S3File } from '@models/utils/file.model';
import { Purchase } from '@models/data/purchase.model';
import { environment } from 'src/environments/environment';
import { cartHasProduct } from 'src/app/core/utils/validation/cart-validation.util';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';
import { getProductText } from 'src/app/core/utils/mapper/whatsapp-mapper.util';
import { Category } from '@models/data/category.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PaymentType } from '@models/data/payment-type.model';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { StaticDataService } from 'src/app/core/services/utils/data/static-data/static-data.service';

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

  category: Category | undefined = undefined;
  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

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

  constructor(
    private categoryService: CategoryService,
    private paymentTypeService: PaymentTypeService,
    private staticDataService: StaticDataService
  ) {}
  
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
    this.category = this.categoryService.getById(product.categoryId ?? 0)() ?? new Category();
    const paymentType = this.paymentTypes().find(pt => pt.name.toUpperCase() === 'WHATSAPP') ?? new PaymentType();
    const phoneNumber = this.category.paymentTypes?.find(pta => pta.id.paymentTypeId == paymentType.id)?.phone ?? '3125543042';
    const productText = getProductText(product);
    const cartRedirect = this.staticDataService.getCartMessage('0', productText, `${phoneNumber}`);
    window.open(cartRedirect, '_blank');
  }

  goBackStore() {
    this.goBackCartEvent.emit();
  }

}
