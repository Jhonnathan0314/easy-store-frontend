import { Component, computed, Input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterModule, FormsModule, MenubarModule, ButtonComponent],
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent {

  @Input() items: MenuItem[] = []; 

  role: Signal<string> = computed(() => this.sessionService.role());

  isAdminSubscription: Subscription;
  adminModeSubscription: Subscription;

  CATEGORY_IMAGE_NAME: string = environment.DEFAULT_IMAGE_CATEGORY_NAME;

  constructor(
    private sessionService: SessionService,
    private securityService: SecurityService
  ) {}

  goToLogin() {
    this.securityService.logout('login');
  }

  goToRegister() {
    this.securityService.logout('register');
  }

  logout() {
    this.securityService.logout('logout');
  }

}
