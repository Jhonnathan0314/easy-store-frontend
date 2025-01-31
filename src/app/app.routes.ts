import { Routes } from '@angular/router';
import { DashboardGuard } from './core/guards/dashboard/dashboard.guard';
import { SecurityGuard } from './core/guards/security/security.guard';

export const routes: Routes = [
  { 
    path: 'security', 
    loadChildren: () => import('./module/security/security.routes').then(m => m.routes), 
    canActivate: [SecurityGuard] 
  },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./module/dashboard/dashboard.routes').then(m => m.routes), 
    canActivate: [DashboardGuard] 
  },
  { path: '', redirectTo: 'security', pathMatch: 'full' },
  { path: '**', redirectTo: 'security', pathMatch: 'full' }
];