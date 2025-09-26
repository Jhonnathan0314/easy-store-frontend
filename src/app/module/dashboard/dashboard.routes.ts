import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LayoutComponent } from './layout/layout.component';
import { adminGuard } from '@guard/admin/admin.guard';
import { ownerGuard } from '@guard/owner/owner.guard';

export const routes: Routes = [
  { path: '', component: LayoutComponent, children: 
    [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: UserProfileComponent },
      { 
        path: 'store', 
        loadChildren: () => import('./pages/store/store.routes').then(m => m.routes) 
      },
      { 
        path: 'category', 
        loadChildren: () => import('./pages/category/category.routes').then(m => m.routes),
        canActivate: [ownerGuard]
      },
      { 
        path: 'subcategory', 
        loadChildren: () => import('./pages/subcategory/subcategory.routes').then(m => m.routes),
        canActivate: [ownerGuard]
      },
      { 
        path: 'product', 
        loadChildren: () => import('./pages/product/product.routes').then(m => m.routes),
        canActivate: [ownerGuard]
      },
      { 
        path: 'payment-type', 
        loadChildren: () => import('./pages/payment-type/payment-type.routes').then(m => m.routes),
        canActivate: [adminGuard]
      },
      { 
        path: 'payment-type-assigned', 
        loadChildren: () => import('./pages/payment-type-assigned/payment-type-assigned.routes').then(m => m.routes),
        canActivate: [ownerGuard]
      },
      { 
        path: 'purchase', 
        loadChildren: () => import('./pages/purchase/purchase.routes').then(m => m.routes),
        canActivate: [ownerGuard]
      },
      { 
        path: 'purchase-client', 
        loadChildren: () => import('./pages/purchase-client/purchase-client.routes').then(m => m.routes)
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];