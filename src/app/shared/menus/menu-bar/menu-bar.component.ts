import { Component, computed, effect, Injector, Input, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterModule, FormsModule, MenubarModule, ButtonComponent],
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent implements OnInit {

  @Input() items: MenuItem[] = []; 

  role: Signal<string> = computed(() => this.sessionService.role());

  isAdminSubscription: Subscription;
  adminModeSubscription: Subscription;

  constructor(
    private injector: Injector,
    private sessionService: SessionService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.validateRole();
  }

  validateRole() {
    effect(() => {
      if(this.role() === 'admin') return;
      if(this.role() === 'ghost') return;
      if(this.role() === 'client') return;
    }, {injector: this.injector})
  }

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
