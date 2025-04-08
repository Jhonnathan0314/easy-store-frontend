import { Routes } from "@angular/router";
import { PaymentTypeAllComponent } from "./payment-type-all/payment-type-all.component";
import { PaymentTypeFormComponent } from "./payment-type-form/payment-type-form.component";

export const routes: Routes = [
    { path: '', component: PaymentTypeAllComponent },
    { path: 'form/category/:_categoryId/payment-type/:_paymentTypeId', component: PaymentTypeFormComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]