import { Routes } from "@angular/router";
import { PurchaseAllComponent } from "./purchase-all/purchase-all.component";

export const routes: Routes = [
    { path: '', component: PurchaseAllComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]