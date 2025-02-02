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

  mode: string = '';

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
    this.mode = 'claro';
    if(element?.length == 0) this.mode = 'oscuro';
    this.configMenuItems();
  }

  configMenuItems() {
    this.mode = this.themeService.getMode() === 'claro' ? 'oscuro' : 'claro';

    this.items = [
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
        items: [
          {
            label: 'Verde',
            command: () => { 
              this.themeService.switchTheme('green');
            }
          },
          {
            label: 'Azul',
            command: () => { 
              this.themeService.switchTheme('sky');
            }
          },
          {
            label: 'Naranja',
            command: () => { 
              this.themeService.switchTheme('amber');
            }
          },
          {
            label: 'Rosado',
            command: () => { 
              this.themeService.switchTheme('pink');
            }
          },
          {
            label: 'Violeta',
            command: () => { 
              this.themeService.switchTheme('violet');
            }
          }
        ],
      },
      {
        label: 'Modo ' + this.mode,
        icon: `pi ${this.mode === 'claro' ? 'pi-sun' : 'pi-moon'}`,
        command: () => { 
          this.themeService.switchMode(this.mode);
          this.configMenuItems();
        }
      },
      { label: 'Salir', icon: 'pi pi-fw pi-sign-out text-primary', command: () => { this.sessionService.logout(); } },
    ];
  }

}
