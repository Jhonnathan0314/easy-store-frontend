import { Component, computed, OnDestroy, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewComponent } from '@component/shared/data/data-view/data-view.component';
import { LoadingDataViewComponent } from '@component/shared/skeleton/loading-data-view/loading-data-view.component';
import { Category } from '@models/data/category.model';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Product } from '@models/data/product.model';
import { Purchase, PurchaseCart, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { Subscription } from 'rxjs';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, DataViewComponent, LoadingDataViewComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  products: Product[] = [];
  productToAdd: PurchaseHasProductRq = new PurchaseHasProductRq();

  purchases: PurchaseCart[] = [];
  cart: PurchaseCart = new PurchaseCart();
  purchase: PurchaseRq = new PurchaseRq();

  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());
  categories: Category[] = [];

  categoryId: number;

  isLoading = false;

  productsSubscription: Subscription;
  purchaseSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private paymentTypeService: PaymentTypeService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.getIdFromPath();
    this.productsSubscribe();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  closeSubscriptions() {
    if(this.productsSubscription)
      this.productsSubscription.unsubscribe();
    if(this.purchaseSubscription)
      this.purchaseSubscription.unsubscribe();
  }

  getIdFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  productsSubscribe() {
    this.productService.findByAccount();
    this.productsSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        this.products = products;
        this.purchaseSubscribe();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.purchases = [];
          this.cart = new PurchaseCart();
        }
        this.isLoading = false;
      }
    })
  }

  purchaseSubscribe() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        if(purchases.length == 0) return;
        this.purchases = purchases.filter(purchase => purchase.state == 'cart');
        this.cart = this.purchases.find(cart => cart.categoryId == this.categoryId) ?? new PurchaseCart();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.purchases = [];
          this.cart = new PurchaseCart();
        }else {
          this.isLoading = false;
        }
      }
    })
  }

  addToCart($event: Product) {
    this.validatePurchase($event);
    this.purchaseService.addPurchaseHasProduct(this.productToAdd).subscribe({
      next: () => { },
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
      next: () => { },
      error: (error) => {
        console.log("Ha ocurrido un error mientras eliminaba producto del carrito", {error});
      }
    })

  }

  validatePurchase(product: Product) {
    const cart = this.purchases.find(cart => cart.categoryId == this.categoryId);
    if(cart != undefined) {
      this.prepareProductToAdd(product, cart);
    }else {
      this.createPurchase(product);
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
      next: () => {
        this.addToCart(product);
      },
      error: (error) => {
        console.log('Ha ocurrido un error al crear el carrito.', error);
      }
    })
  }

  prepareNewPurchase() {
    this.purchase.categoryId = this.categoryId;
    this.purchase.state = 'cart';
    this.purchase.paymentTypeId = this.paymentTypes()[0].id;
  }

  buyNow($event: Product) {
    console.log("products componente buy now event: ", $event);
  }

  goCart() {
    this.router.navigateByUrl('/dashboard/store/cart');
  }

}
