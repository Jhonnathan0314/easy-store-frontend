import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'security', 
    loadChildren: () => import('./module/security/security.routes').then(m => m.routes)
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./module/dashboard/dashboard.routes').then(m => m.routes)
  },
  { path: '', redirectTo: 'security', pathMatch: 'full' },
  { path: '**', redirectTo: 'security', pathMatch: 'full' }
];