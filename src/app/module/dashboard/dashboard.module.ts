import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { CoreModule } from 'src/app/core/core.module';


@NgModule({
  declarations: [
    LayoutComponent,
    HomeComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CoreModule
  ]
})
export class DashboardModule { }
