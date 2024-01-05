import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TopbarComponent } from './components/global/topbar/topbar.component';
import { SecurityTopbarComponent } from './components/security/topbar/topbar.component';
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
    SecurityTopbarComponent,
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
    SecurityTopbarComponent,
    CarouselHomeComponent
  ]
})
export class CoreModule { }
