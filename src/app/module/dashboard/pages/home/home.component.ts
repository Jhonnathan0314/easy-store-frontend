import { Component, computed, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselHomeComponent } from '@component/core/global/carousel-home/carousel-home.component';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { SessionData } from '@models/security/security-data.model';
import { SessionService } from 'src/app/core/services/utils/session/session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CarouselHomeComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class HomeComponent {

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  redirectTo(path: string) {
    this.router.navigateByUrl(path);
  }

}
