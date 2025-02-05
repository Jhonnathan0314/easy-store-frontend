import { Routes } from "@angular/router";
import { SubcategoryAllComponent } from "./subcategory-all/subcategory-all.component";
import { SubcategoryFormComponent } from "./subcategory-form/subcategory-form.component";

export const routes: Routes = [
    { path: '', component: SubcategoryAllComponent },
    { path: 'form/:_id', component: SubcategoryFormComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]