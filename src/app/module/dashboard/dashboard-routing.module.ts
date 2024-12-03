import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', component: LayoutComponent, children: 
    [
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: UserProfileComponent },
      { path: 'store', loadChildren: () => import('./pages/store/store.module').then(m => m.StoreModule) },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
