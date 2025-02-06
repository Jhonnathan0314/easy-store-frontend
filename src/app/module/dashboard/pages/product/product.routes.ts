import { Routes } from "@angular/router";
import { ProductAllComponent } from "./product-all/product-all.component";
import { ProductFormComponent } from "./product-form/product-form.component";

export const routes: Routes = [
    { path: '', component: ProductAllComponent },
    { path: 'form/:_id', component: ProductFormComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]