import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '@component/core/global/topbar/topbar.component';
import { Subscription } from 'rxjs';
import { CategoryFormComponent } from '../pages/category/category-form/category-form.component';
import { FormErrors } from '@models/security/security-error.model';
import { MessageComponent } from '@component/shared/informative/message/message.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SubcategoryFormComponent } from '../pages/subcategory/subcategory-form/subcategory-form.component';
import { ProductFormComponent } from '../pages/product/product-form/product-form.component';
import { PaymentTypeFormComponent } from '../pages/payment-type/payment-type-form/payment-type-form.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, ToastModule, TopbarComponent, MessageComponent],
  templateUrl: './layout.component.html',
  providers: [ MessageService ]
})
export class LayoutComponent {

  @ViewChild(MessageComponent) messageComponent: MessageComponent;

  categorySubscription: Subscription | undefined;
  subcategorySubscription: Subscription | undefined;
  productSubscription: Subscription | undefined;
  paymentTypeSubscription: Subscription | undefined;

  detailError: string = '';

  onActivate(componentRef: Component) {
    this.categorySubscription = undefined;
    this.subcategorySubscription = undefined;
    if (componentRef instanceof CategoryFormComponent) {
      this.categorySubscription = componentRef.categoryErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
    if (componentRef instanceof SubcategoryFormComponent) {
      this.subcategorySubscription = componentRef.subcategoryErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
    if (componentRef instanceof ProductFormComponent) {
      this.productSubscription = componentRef.productErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
    if (componentRef instanceof PaymentTypeFormComponent) {
      this.paymentTypeSubscription = componentRef.paymentTypeErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
  }

  showFormErrors(formErrors: FormErrors) {
    Object.keys(formErrors).forEach(field => {
      this.detailError = `El campo ${field} `;
      if(formErrors[field].includes('required')) this.detailError += 'es obligatorio.';
      this.messageComponent.showError('Error en el formulario', this.detailError);
    });
  }

}
