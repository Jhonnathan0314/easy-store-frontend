import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { Purchase, PurchaseHasProduct, PurchaseMap } from '@models/data/purchase.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { User } from '@models/security/user.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Category } from '@models/data/category.model';
import { Product } from '@models/data/product.model';
import { Router } from '@angular/router';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { UserService } from 'src/app/core/services/api/data/user/user.service';
import { PurchaseReportComponent } from "../purchase-report/purchase-report.component";
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-purchase-all',
  standalone: true,
  imports: [MessageModule, ButtonComponent, TableComponent, LoadingTableComponent, PurchaseReportComponent],
  templateUrl: './purchase-all.component.html'
})
export class PurchaseAllComponent implements OnInit {
  
  mappedPurchases: DataObject[] = [];
  
  users: Signal<User[]> = computed(() => this.userService.users());
  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  products: Signal<Product[]> = computed(() => this.productService.products());
  purchases: Signal<Purchase[]> = computed(() => this.purchaseService.purchases());

  purchaseMap = new PurchaseMap();
  user = new User();
  paymentType = new PaymentType();
  category = new Category();
  product = new Product();
  purchase = new Purchase();
  hasProducts: PurchaseHasProduct[] = [];

  isDetailSelected: boolean = false;
  detailSelectedId: number = 0;
  detailSelectedIndex: number = 0;

  viewChart: boolean = false;

  isLoading: boolean = true;

  constructor(
    private router: Router,
    private injector: Injector,
    private userService: UserService,
    private paymentTypeService: PaymentTypeService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.convertToDataObject();
  }

  convertToDataObject() {
    effect(() => {
      if(!this.objectsReceived()) return;
      this.mappedPurchases = this.purchases().map(purch => {
        this.extractObjectsByPurchase(purch);
        this.extractPurchaseHasObjects(purch);
        this.completePurchaseMap(purch);
        return { purchase: this.purchaseMap };
      })
      this.isLoading = false;
    }, {injector: this.injector})
  }

  objectsReceived() {
    return this.users().length > 0 && this.paymentTypes().length > 0 && 
        this.categories().length > 0 && this.products().length > 0;
  }

  extractObjectsByPurchase(purchase: Purchase) {
    this.user = this.users().find(us => us.id == purchase.userId) ?? new User();
    this.paymentType = this.paymentTypes().find(pay => pay.id == purchase.paymentTypeId) ?? new PaymentType();
    this.category = this.categories().find(cat => cat.id == purchase.categoryId) ?? new Category();
  }

  extractPurchaseHasObjects(purchase: Purchase) {
    this.hasProducts = purchase.products.filter(php => php.id.purchaseId === purchase.id) || [];
    this.hasProducts = this.hasProducts.map(hasProd => {
      this.product = this.products().find(prod => prod.id === hasProd.id.productId) ?? new Product();
      this.purchase = this.purchases().find(pur => pur.id === hasProd.id.purchaseId) ?? new Purchase();
      return { 
        id: hasProd.id, 
        quantity: hasProd.quantity, 
        subtotal: hasProd.subtotal, 
        unitPrice: hasProd.unitPrice,
        product: this.product,
        purchase: this.purchase
      }
    })
  }

  completePurchaseMap(purchase: Purchase) {
    this.purchaseMap = {
      id: purchase.id,
      user: this.user,
      paymentType: this.paymentType, 
      category: this.category,
      total: purchase.total,
      state: purchase.state,
      creationDate: purchase.creationDate,
      products: this.hasProducts
    }
  }

  deleteById(purchase: DataObject) {
    this.purchaseService.deleteById(purchase.purchase?.id ?? 0);
  }

  viewDetail($event: number) {
    this.isDetailSelected = true;
    this.detailSelectedId = $event;
    this.detailSelectedIndex = this.mappedPurchases.findIndex(map => map.purchase?.id === $event);
  }

  eventViewChart() {
    this.viewChart = !this.viewChart;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
