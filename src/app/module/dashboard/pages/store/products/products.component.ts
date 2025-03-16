import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataViewComponent } from '@component/shared/data/data-view/data-view.component';
import { Category } from '@models/data/category.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Product } from '@models/data/product.model';
import { Purchase, PurchaseCart, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { Subscription } from 'rxjs';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, DataViewComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  products: Product[] = [];
  productToAdd: PurchaseHasProductRq = new PurchaseHasProductRq();

  purchases: PurchaseCart[] = [];
  purchase: PurchaseRq = new PurchaseRq();

  paymentTypes: PaymentType[] = [];
  categories: Category[] = [];

  categoryId: number;

  productsSubscription: Subscription;
  purchaseSubscription: Subscription;
  paymentTypeSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private paymentTypeService: PaymentTypeService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit(): void {
    this.getIdFromPath();
    this.productsSubscribe();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  getIdFromPath() {
    this.categoryId = parseInt(this.activatedRoute.snapshot.params['_id']);
  }

  productsSubscribe() {
    this.productsSubscription = this.productService.getByCategoryId(this.categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.purchaseSubscribe();
      },
      error: (error) => {
        console.log("Ha ocurrido un error en productos.", error);
      }
    })
  }

  purchaseSubscribe() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        this.purchases = purchases;
        this.paymentTypeSubscribe();
      },
      error: (error) => {
        console.log("Ha ocurrido un error en productos.", error);
      }
    })
  }

  paymentTypeSubscribe() {
    this.paymentTypeSubscription = this.paymentTypeService.storedPaymentTypes$.subscribe({
      next: (paymentTypes) => {
        this.paymentTypes = paymentTypes;
      },
      error: (error) => {
        console.log("Ha ocurrido un error en tipos de pago.", error);
      }
    })
  }

  addToCart($event: Product) {
    this.validatePurchase($event);
    this.purchaseService.addPurchaseHasProduct(this.productToAdd).subscribe({
      next: (response) => { },
      error: (error) => {
        console.log("Ha ocurrido un error mientras agregaba producto al carrito", {error});
      }
    })
  }

  validatePurchase(product: Product) {
    const purchase = this.purchases.find(purchase => purchase.categoryId == this.categoryId && purchase.state == 'cart');
    if(purchase != undefined) {
      this.prepareProductToAdd(product, purchase);
    }else {
      this.createPurchase(product);
    }
  }

  prepareProductToAdd(product: Product, purchase: Purchase){
    this.productToAdd = {
      id: {
        productId: product.id,
        purchaseId: purchase.id
      },
      quantity: 1
    }
  }

  createPurchase(product: Product) {
    this.prepareNewPurchase();
    this.purchaseService.generate(this.purchase).subscribe({
      next: (response) => {
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
    this.purchase.paymentTypeId = this.paymentTypes[0].id;
  }

  buyNow($event: Product) {
    console.log("products componente buy now event: ", $event);
  }

}
