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
      { path: 'shoes', loadChildren: () => import('./pages/sophie-shoes/sophie-shoes.module').then(m => m.SophieShoesModule) },
      { path: 'offers', loadChildren: () => import('./pages/sophie-offers/sophie-offers.module').then(m => m.SophieOffersModule) },
      { path: 'launch', loadChildren: () => import('./pages/sophie-launch/sophie-launch.module').then(m => m.SophieLaunchModule) },
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
