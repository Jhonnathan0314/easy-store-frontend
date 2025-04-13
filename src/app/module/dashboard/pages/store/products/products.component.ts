import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewComponent } from '@component/shared/data/data-view/data-view.component';
import { LoadingDataViewComponent } from '@component/shared/skeleton/loading-data-view/loading-data-view.component';
import { Category } from '@models/data/category.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Product } from '@models/data/product.model';
import { Purchase, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';

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

  purchases: Signal<Purchase[]> = computed(() => this.purchaseService.purchases());
  cart: Purchase = new Purchase();
  purchase: PurchaseRq = new PurchaseRq();

  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

  categoryId: number;
  category: Signal<Category | undefined> = computed(() => this.categoryService.categories().find(cat => cat.id == this.categoryId));

  selectedProduct: Product | undefined = undefined;

  idsFinded: number[] = [];

  viewDetail: boolean = false;
  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
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
      if(this.paymentTypes().length === 0) {
        this.paymentTypeService.findAllActive();
      }
      if(this.purchases().length === 0) return;
      this.cart = this.purchases().find(cart => cart.categoryId == this.categoryId && cart.state == 'cart') ?? new Purchase();
    }, {injector: this.injector, allowSignalWrites: true})
  }

  addToCart($event: Product) {
    if(!this.validatePurchase($event)) return;
    this.purchaseService.addPurchaseHasProduct(this.productToAdd).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error mientras agregaba producto al carrito", {error});
      }
    })
  }

  removeFromCart($event: Product) {
    const hasProductId: PurchaseHasProductId = {
      productId: $event.id,
      purchaseId: this.cart.id
    }
    this.purchaseService.deletePurchaseHasProductById(hasProductId).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error mientras eliminaba producto del carrito", {error});
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
    this.prepareNewPurchase();
    this.purchaseService.generate(this.purchase).subscribe({
      error: (error) => {
        console.log('Ha ocurrido un error al crear el carrito.', error);
      },
      complete: () => {
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
    if(!this.productImagesFinded().includes(product.id)) {
      this.productService.findProductImages(product.id, this.category()?.accountId).subscribe({
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
  }

  hideDetailProduct() {
    this.viewDetail = false;
    this.selectedProduct = undefined;
  }

}
