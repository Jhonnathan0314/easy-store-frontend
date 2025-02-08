import { Routes } from "@angular/router";
import { PurchaseAllComponent } from "./purchase-all/purchase-all.component";
import { PurchaseReportComponent } from "./purchase-report/purchase-report.component";

export const routes: Routes = [
    { path: '', component: PurchaseAllComponent },
    { path: 'report', component: PurchaseReportComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]