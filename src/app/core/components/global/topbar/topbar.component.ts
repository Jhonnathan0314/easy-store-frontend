import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {

  items: MenuItem[] = [];

  constructor(private themeService: ThemeService, private router: Router, private sessionService: SessionService) {
    this.itemsOptions();
  }

  itemsOptions() {
    this.items = [
      { label: 'Menu', icon: 'pi pi-fw pi-home', command: () => { this.router.navigateByUrl('/dashboard/home') } },
      { label: 'Sophie shoes', icon: 'pi pi-fw pi-shopping-bag', command: () => { this.router.navigateByUrl('/dashboard/shoes') } },
      { label: 'Sophie offers', icon: 'pi pi-fw pi-dollar', command: () => { this.router.navigateByUrl('/dashboard/offers') } },
      { label: 'Onces sofi', icon: 'pi pi-fw pi-gift', command: () => { this.router.navigateByUrl('/dashboard/launch') } },
      { label: 'Mi perfil', icon: 'pi pi-fw pi-user', command: () => { this.router.navigateByUrl('/dashboard/profile') } },
      { 
        label: 'Tema actual', 
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Azul claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-blue'); }
          },
          {
            label: 'Verde claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-green'); }
          },
          {
            label: 'Naranja claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-orange'); }
          },
          {
            label: 'Purpura claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-purple'); }
          },
          {
            label: 'Azul oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-blue'); }
          },
          {
            label: 'Verde oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-green'); }
          },
          {
            label: 'Naranja oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-orange'); }
          },
          {
            label: 'Purpura oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-purple'); }
          }
        ]
      },
      { label: 'Salir', icon: 'pi pi-fw pi-sign-out', command: () => { this.sessionService.logout(); } },
    ];
  }

}
