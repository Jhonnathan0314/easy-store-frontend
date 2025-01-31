import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBarComponent } from '@component/shared/menus/menu-bar/menu-bar.component';
import { MenuItem } from 'primeng/api';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  items: MenuItem[] = [];

  theme: string = ''

  constructor(
    private themeService: ThemeService, 
    private router: Router, 
    private sessionService: SessionService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.configMenuItems();
  }

  updateThemeText() {
    const element = this.document.querySelector('html')?.classList;
    this.theme = 'Claro';
    if(element?.length == 0) this.theme = 'Oscuro';
    this.configMenuItems();
  }

  configMenuItems() {
    this.items = [
      { label: 'Menu', icon: 'pi pi-fw pi-home text-primary', command: () => { this.router.navigateByUrl('/dashboard/home') } },
      { label: 'Store', icon: 'pi pi-fw pi-shopping-bag text-primary', command: () => { this.router.navigateByUrl('/dashboard/store') } },
      { label: 'Mi perfil', icon: 'pi pi-fw pi-user text-primary', command: () => { this.router.navigateByUrl('/dashboard/profile') } },
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
        items: [
          {
            label: this.theme,
            escape: true,
            command: () => { 
              this.themeService.switchTheme('my-app-dark', this.theme);
              this.updateThemeText();
            }
          }
        ],
      },
      { label: 'Salir', icon: 'pi pi-fw pi-sign-out text-primary', command: () => { this.sessionService.logout(); } },
    ];
  }

}
