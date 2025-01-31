import { Component } from '@angular/core';
import { CarouselHomeComponent } from '@component/core/global/carousel-home/carousel-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselHomeComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
