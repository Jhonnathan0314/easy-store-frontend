import { Routes } from "@angular/router";
import { CategoryAllComponent } from "./category-all/category-all.component";
import { CategoryFormComponent } from "./category-form/category-form.component";

export const routes: Routes = [
    { path: '', component: CategoryAllComponent },
    { path: 'form/:_id', component: CategoryFormComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
]