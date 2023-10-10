import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { CarouselHomeObject } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css'],
})
export class CarouselHomeComponent implements OnInit, AfterViewInit {

  @ViewChildren('section') container: ElementRef;

  items: CarouselHomeObject[] = [];

  screenWidth: number = screen.width;
  itemClass: string = '';

  private listenerFn: () => void;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.defineItems();
    this.validateActualItem();
  }

  ngAfterViewInit(): void {
    this.changesFunction();
  }

  changesFunction() {
    this.listenerFn = this.renderer.listen('window', 'resize', (event) => {
      this.screenWidth = event.target.innerWidth;
      this.defineItems();
      this.validateActualItem();
    });
  }

  defineItems() {
    this.items = [
      {
        title: 'Sophie shoes',
        img: '../../../../../assets/img/shoes.png',
        body: 'Compra todo tipo de productos de revista! Ingresa y observa todos los productos disponibles.',
        value: 'shoes',
        hidden: '',
        classes: ''
      },
      {
        title: 'Sophie offers',
        img: '../../../../../assets/img/offers.png',
        body: 'Aprovecha las ofertas temporales! Adquiere lo que requieras al mejor precio',
        value: 'offers',
        hidden: '',
        classes: ''
      },
      {
        title: 'Las onces de sofi',
        img: '../../../../../assets/img/launch.png',
        body: 'Pide ahora los mejores postres a domicilio! Disponible en la ciudad de Tunja',
        value: 'launch',
        hidden: '',
        classes: ''
      }
    ]
  }

  validateActualItem() {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 1150) {
      this.itemClass = 'item w-12 flex justify-content-start align-items-center';
    } else {
      this.itemClass = 'item w-11 h-full m-auto text-center flex flex-column justify-content-center align-items-center';
    }
  }

}
