import { Component, computed, effect, Injector, Input, OnInit, Signal } from '@angular/core';
import { Category, CategoryHasPaymentType } from '@models/data/category.model';
import { AccordionModule } from 'primeng/accordion';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { ButtonComponent } from "@component/shared/inputs/button/button.component";
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { Purchase } from '@models/data/purchase.model';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { PaymentType } from '@models/data/payment-type.model';
import { getProductsTextFromCart } from 'src/app/core/utils/mapper/whatsapp-mapper.util';
import { StaticDataService } from 'src/app/core/services/utils/data/static-data/static-data.service';
import { Message } from "primeng/message";

@Component({
  selector: 'app-purchase-method',
  standalone: true,
  imports: [AccordionModule, ButtonComponent, Message],
  templateUrl: './purchase-method.component.html'
})
export class PurchaseMethodComponent implements OnInit {

  @Input() cartId: number = 0;

  purchases: Signal<Purchase[]> = computed(() => this.purchaseService.purchases());
  purchase: Purchase | undefined = undefined;

  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  category: Category | undefined = undefined;

  paymentTypes: Signal<PaymentType[]> = computed(() => this.paymentTypeService.paymentTypes());

  catPaymentTypes: CategoryHasPaymentType[] = [];

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);

  whatsappError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
    private paymentTypeService: PaymentTypeService,
    private staticDataService: StaticDataService,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.cartId = parseInt(this.activatedRoute.snapshot.params['_cartId']);
    this.findPurchase();
  }

  findPurchase() {
    effect(() => {
      if(this.purchases().length == 0) return;
      this.purchase = this.purchases().find(purchase => purchase.id == this.cartId);
      this.category = this.categories().find(category => category.id == this.purchase?.categoryId);
      this.catPaymentTypes = this.category?.paymentTypes ?? [];
      this.catPaymentTypes.forEach(cpt => {
        cpt.paymentType = this.paymentTypes().find(pt => pt.id == cpt.id.paymentTypeId) ?? new PaymentType();
      });
      console.log("Guardo los datos", {purchase: this.purchase, category: this.category, catPaymentTypes: this.catPaymentTypes});
    }, {injector: this.injector});
  }

  selectPaymentType(catPaymentType: CategoryHasPaymentType) {
    if(catPaymentType.paymentType?.name.toUpperCase() == 'WHATSAPP') {
      this.goToWhatsapp(catPaymentType);
    }
  }

  goToWhatsapp(catPaymentType: CategoryHasPaymentType) {
    const productText = getProductsTextFromCart(this.purchase ?? new Purchase());
    const phoneNumber = `${catPaymentType.phone}` || 'error';
    const purchaseRedirect = this.staticDataService.getCartMessage(`${this.purchase?.id}`, productText, phoneNumber);
    if(phoneNumber == 'error') {
      this.whatsappError = true;
      return;
    }
    this.whatsappError = false;
    window.open(purchaseRedirect, '_blank');
  }

}
