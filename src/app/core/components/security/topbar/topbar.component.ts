import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SplitButtonComponent } from '@component/shared/menus/split-button/split-button.component';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-security-topbar',
  standalone: true,
  imports: [SplitButtonComponent],
  templateUrl: './topbar.component.html'
})
export class SecurityTopbarComponent {

  items: MenuItem[] = [];

  mode: string = ''

  CATEGORY_IMAGE_NAME: string = environment.DEFAULT_IMAGE_CATEGORY_NAME;

  constructor(public themeService: ThemeService, @Inject(DOCUMENT) private document: Document) {
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
      {
        label: 'Ayuda y soporte',
        icon: 'pi pi-fw pi-question-circle',
        command: () => { } 
      }
    ];
  }

}
