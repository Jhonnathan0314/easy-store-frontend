import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselHomeComponent } from '@component/core/global/carousel-home/carousel-home.component';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CarouselHomeComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class HomeComponent {

  constructor(private router: Router) { }

  redirectTo(path: string) {
    this.router.navigateByUrl(path);
  }

}
