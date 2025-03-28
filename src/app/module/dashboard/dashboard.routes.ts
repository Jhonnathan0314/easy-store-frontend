import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardGuard } from '@guard/dashboard/dashboard.guard';

export const routes: Routes = [
  { path: '', component: LayoutComponent, children: 
    [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'store', loadChildren: () => import('./pages/store/store.routes').then(m => m.routes) },
      { 
        path: 'category', 
        loadChildren: () => import('./pages/category/category.routes').then(m => m.routes),
        canActivate: [DashboardGuard]
      },
      { 
        path: 'subcategory', 
        loadChildren: () => import('./pages/subcategory/subcategory.routes').then(m => m.routes),
        canActivate: [DashboardGuard]
      },
      { 
        path: 'product', 
        loadChildren: () => import('./pages/product/product.routes').then(m => m.routes),
        canActivate: [DashboardGuard]
      },
      { 
        path: 'payment-type', 
        loadChildren: () => import('./pages/payment-type/payment-type.routes').then(m => m.routes),
        canActivate: [DashboardGuard]
      },
      { 
        path: 'purchase', 
        loadChildren: () => import('./pages/purchase/purchase.routes').then(m => m.routes) ,
        canActivate: [DashboardGuard]
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];