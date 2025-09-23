import { Routes } from "@angular/router";
import { PaymentTypeAssignedFormComponent } from "./payment-type-assigned-form/payment-type-assigned-form.component";
import { PaymentTypeAssignedAllComponent } from "./payment-type-assigned-all/payment-type-assigned-all.component";

export const routes: Routes = [
    { path: '', component: PaymentTypeAssignedAllComponent },
    { path: 'form/category/:_categoryId/payment-type/:_paymentTypeId', component: PaymentTypeAssignedFormComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]