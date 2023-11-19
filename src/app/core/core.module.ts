import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TopbarComponent } from './components/global/topbar/topbar.component';
import { FooterComponent } from './components/global/footer/footer.component';
import { LoginComponent } from './components/forms/security/login/login.component';
import { RegisterComponent } from './components/forms/security/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CarouselHomeComponent } from './components/global/carousel-home/carousel-home.component';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    TopbarComponent,
    FooterComponent,
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

    ToastModule
  ],
  exports: [
    TopbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    CarouselHomeComponent
  ]
})
export class CoreModule { }
