import { StaticDataService } from './../../../../../core/services/utils/data/static-data/static-data.service';
import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { Category } from '@models/data/category.model';
import { Purchase, PurchaseHasProduct } from '@models/data/purchase.model';
import { AccordionModule } from 'primeng/accordion';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router, RouterModule } from '@angular/router';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { Product } from '@models/data/product.model';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ErrorMessage } from '@models/data/general.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { environment } from 'src/environments/environment';
import { SessionData } from '@models/security/security-data.model';
import { getProductsText } from 'src/app/core/utils/mapper/whatsapp-mapper.util';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterModule, ImagePipe, AccordionModule, DividerModule, SkeletonModule, MessageModule, ToastModule, ButtonComponent],
  templateUrl: './cart.component.html',
  providers: [MessageService]
})
export class CartComponent implements OnInit {

  purchasesError: Signal<ErrorMessage | null> = computed(() => this.purchaseService.purchasesError());
  purchases: Signal<Purchase[]> = computed(() => this.purchaseService.purchases());
  carts: Purchase[] =[];

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());

  productsError: Signal<ErrorMessage | null> = computed(() => this.productService.productsError());
  products: Signal<Product[]> = computed(() => this.productService.products());

  userId: number = 0;

  cartRedirect: string = "";

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  PRODUCT_IMAGE_NAME: string = environment.DEFAULT_IMAGE_PRODUCT_NAME;

  constructor(
    private router: Router,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    public staticDataService: StaticDataService,
    private sessionService: SessionService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.findUserId();
    this.validateCategoriesError();
    this.validateProductsError();
    this.validatePurchasesError();
    this.extractCarts();
  }

  findUserId() {
    this.userId = this.session()?.userId ?? -1;
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code !== 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  validateProductsError() {
    effect(() => {
      if(this.productsError() == null) return;
      if(this.productsError()?.code !== 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  validatePurchasesError() {
    effect(() => {
      if(this.purchasesError() == null) return;
      if(this.purchasesError()?.code !== 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  extractCarts() {
    effect(() => {
      this.carts = this.purchases().filter((purchase) => purchase.state == 'cart' && purchase.userId == this.userId);
      this.savePurchases();
    }, {injector: this.injector})
  }

  savePurchases() {
    this.carts.forEach((cart) => {
      cart.category = this.categories().find(category => category.id == cart.categoryId);
      cart.products = cart.products.map(product => {
        product.product = this.products().find(prod => prod.id == product.id.productId);
        return product;
      })
    })
  }

  plusProductToCart(product: PurchaseHasProduct) {
    product.quantity += 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      error: (error: ErrorMessage) => {
        product.quantity -= 1;
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.detail});
      }
    })
  }

  minusProductToCart(product: PurchaseHasProduct) {
    product.quantity -= 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      error: (error: ErrorMessage) => {
        if(error.code === 404) {
          product.quantity += 1;
        }
      }
    })
  }

  deleteFromCart(product: PurchaseHasProduct) {
    this.purchaseService.deletePurchaseHasProductById(product.id).subscribe({
      error: (error) => {
        console.log('Ha ocurrio un error al eliminar el articulo del carrito.', error);
      }
    })
  }

  goToStore(categoryId: number) {
    this.router.navigateByUrl(`/dashboard/store/products/${categoryId}`)
  }

  buyNow(cart: Purchase) {
    const productText = getProductsText(cart);
    this.cartRedirect = this.staticDataService.getCartMessage(`${cart.id}`, productText, this.getPhoneNumber(cart));
    window.open(this.cartRedirect, '_blank');
  }

  getPhoneNumber(cart: Purchase) {
    return `${cart.category?.paymentTypes?.find(paymentType => paymentType.phone)?.phone ?? '3125543042'}`;
  }

}
