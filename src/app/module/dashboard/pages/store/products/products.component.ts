import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewComponent } from '@component/shared/data/data-view/data-view.component';
import { LoadingDataViewComponent } from '@component/shared/skeleton/loading-data-view/loading-data-view.component';
import { Category } from '@models/data/category.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Product } from '@models/data/product.model';
import { Purchase, PurchaseCart, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ProductDetailComponent } from "../product-detail/product-detail.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, DataViewComponent, LoadingDataViewComponent, ProductDetailComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  
  products: Signal<Product[]> = computed(() => this.productService.products().filter(prod => prod.categoryId == this.categoryId));
  productImagesFinded: Signal<number[]> = computed(() => this.productService.productImagesFinded());
  productToAdd: PurchaseHasProductRq = new PurchaseHasProductRq();

  purchases: Signal<PurchaseCart[]> = computed(() => this.purchaseService.purchases());
  cart: PurchaseCart = new PurchaseCart();
  purchase: PurchaseRq = new PurchaseRq();

  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

  categoryId: number;
  category: Signal<Category | undefined> = computed(() => this.categoryService.categories().find(cat => cat.id == this.categoryId));

  selectedProduct: Product | undefined = undefined;

  idsFinded: number[] = [];

  viewDetail: boolean = false;
  isLoading: boolean = true;
  isWorking: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private injector: Injector,
    private productService: ProductService,
    private paymentTypeService: PaymentTypeService,
    private purchaseService: PurchaseService,
    private categoryService: CategoryService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.getIdFromPath();
    this.extractCart();
  }

  getIdFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  extractCart() {
    const isAdmin = this.sessionService.getRole() === 'admin';
    effect(() => {
      if(!this.category()) return;
      if(!isAdmin && this.products().length == 0) {
        this.productService.findByCategoryId(this.category() ?? new Category());
      }
      if(this.paymentTypes().length === 0 && this.category) {
        this.paymentTypeService.findAllByAccountId(this.category()?.accountId);
      }
      this.isLoading = false;
      if(this.purchases().length === 0) return;
      this.cart = this.purchases().find(cart => cart.categoryId == this.categoryId && cart.state == 'cart') ?? new PurchaseCart();
    }, {injector: this.injector})
  }

  addToCart($event: Product) {
    if(!this.validatePurchase($event)) return;
    this.isWorking = true;
    this.purchaseService.addPurchaseHasProduct(this.productToAdd).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error mientras agregaba producto al carrito", {error});
      },
      complete: () => {
        this.isWorking = false;
      }
    })
  }

  removeFromCart($event: Product) {
    this.isWorking = true;
    const hasProductId: PurchaseHasProductId = {
      productId: $event.id,
      purchaseId: this.cart.id
    }
    this.purchaseService.deletePurchaseHasProductById(hasProductId).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error mientras eliminaba producto del carrito", {error});
      },
      complete: () => {
        this.isWorking = false;
      }
    })

  }

  validatePurchase(product: Product): boolean {
    const cart = this.purchases().find(cart => cart.categoryId == this.categoryId);
    if(cart != undefined) {
      this.prepareProductToAdd(product, cart);
      return true;
    }else {
      this.createPurchase(product);
      return false;
    }
  }

  prepareProductToAdd(product: Product, cart: Purchase){
    this.productToAdd = {
      id: {
        productId: product.id,
        purchaseId: cart.id
      },
      quantity: 1
    }
  }

  createPurchase(product: Product) {
    this.isWorking = true;
    this.prepareNewPurchase();
    this.purchaseService.generate(this.purchase).subscribe({
      error: (error) => {
        console.log('Ha ocurrido un error al crear el carrito.', error);
      },
      complete: () => {
        this.isWorking = false;
        this.addToCart(product);
      }
    })
  }

  prepareNewPurchase() {
    this.purchase.categoryId = this.categoryId;
    this.purchase.state = 'cart';
    this.purchase.paymentTypeId = this.paymentTypes()[0].id;
  }

  goCart() {
    this.router.navigateByUrl('/dashboard/store/cart');
  }

  viewProduct(product: Product) {
    this.isWorking = true;
    if(!this.productImagesFinded().includes(product.id)) {
      this.productService.findProductImages(product.id).subscribe({
        complete: () => {
          this.showDetailProduct(product.id);
        }
      });
    }else {
      this.showDetailProduct(product.id);
    }
  }

  showDetailProduct(id: number) {
    this.viewDetail = true;
    this.selectedProduct = this.products().find(prod => prod.id == id);
    this.isWorking = false;
  }

  hideDetailProduct() {
    this.viewDetail = false;
    this.selectedProduct = undefined;
  }

}
