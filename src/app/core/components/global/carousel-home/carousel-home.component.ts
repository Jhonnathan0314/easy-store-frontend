import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselHomeObject } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css'],
})
export class CarouselHomeComponent implements OnInit {

  items: CarouselHomeObject[] = [];

  responsiveOptions: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.defineResponsiveOptions();
    this.defineItems();
  }

  defineResponsiveOptions() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '1150px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '700px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  defineItems() {
    this.items = [
      {
        title: 'Sophie shoes',
        img: '../../../../../assets/img/shoes.png',
        body: 'Compra todo tipo de productos de revista! Ingresa y observa todos los productos disponibles.',
        value: 'shoes'
      },
      {
        title: 'Sophie offers',
        img: '../../../../../assets/img/offers.png',
        body: 'Aprovecha las ofertas temporales! Adquiere lo que requieras al mejor precio',
        value: 'offers'
      },
      {
        title: 'Las onces de sofi',
        img: '../../../../../assets/img/launch.png',
        body: 'Pide ahora los mejores postres a domicilio! Disponible en la ciudad de Tunja',
        value: 'launch'
      }
    ]
  }

}
