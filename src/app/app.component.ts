import { Component, computed, effect, Inject, Injector, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SessionService } from './core/services/session/session.service';
import { SecurityService } from './core/services/api/security/security.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  security: Signal<string> = computed(() => this.securityService.security());

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private primeng: PrimeNG,
    private injector: Injector,
    private router: Router,
    private sessionService: SessionService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.primeng.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100
    };

    if (isPlatformBrowser(this.platformId)) {
      this.validateSecurity();
      this.validateSession();
    }
  }

  validateSecurity() {
    effect(() => {
      if (this.security() === 'login') {
        this.router.navigateByUrl('/security/login');
      } else if (this.security() === 'register') {
        this.router.navigateByUrl('/security/register');
      } else if (this.security() === 'logout') {
        this.validateSession();
        this.router.navigateByUrl('/dashboard/home')
      }else {
        if (isPlatformBrowser(this.platformId)) {
          const currentPath = window.location.href;
          if(!currentPath.includes('dashboard')) {
            this.router.navigateByUrl('/dashboard/home')
          }
        }
      }
    }, {injector: this.injector})
  }

  validateSession() {
    const isLogged = this.sessionService.isLogged();
    console.log('validateSession', {isLogged});
    if(isLogged) return;
    this.securityService.loginGhost();
  }

}
