import { Routes } from "@angular/router";
import { PurchaseMethodComponent } from "./purchase-method/purchase-method.component";

export const routes: Routes = [
    { path: 'method/:_cartId', component: PurchaseMethodComponent },
    { path: '**', redirectTo: 'method/0', pathMatch: 'full' }
]