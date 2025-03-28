import { Component, computed, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselHomeComponent } from '@component/core/global/carousel-home/carousel-home.component';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { SessionService } from 'src/app/core/services/session/session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CarouselHomeComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class HomeComponent {

  role: Signal<string> = computed(() => this.sessionService.role());

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  redirectTo(path: string) {
    this.router.navigateByUrl(path);
  }

}
