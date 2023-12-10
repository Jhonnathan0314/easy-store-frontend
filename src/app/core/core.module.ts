import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TopbarComponent } from './components/global/topbar/topbar.component';
import { LoginComponent } from './components/forms/security/login/login.component';
import { RegisterComponent } from './components/forms/security/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CarouselHomeComponent } from './components/global/carousel-home/carousel-home.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';


@NgModule({
  declarations: [
    TopbarComponent,
    LoginComponent,
    RegisterComponent,
    CarouselHomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,

    ToastModule,
    CardModule,
    CarouselModule
  ],
  exports: [
    TopbarComponent,
    LoginComponent,
    RegisterComponent,
    CarouselHomeComponent
  ]
})
export class CoreModule { }
