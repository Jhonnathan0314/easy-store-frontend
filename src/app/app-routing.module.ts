import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'security', loadChildren: () => import('./module/security/security.module').then(m => m.SecurityModule) },
  { path: 'dashboard', loadChildren: () => import('./module/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: '', redirectTo: 'security', pathMatch: 'full' },
  { path: '**', redirectTo: 'security', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
