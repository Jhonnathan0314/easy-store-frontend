import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { SplitButtonComponent } from '@component/shared/menus/split-button/split-button.component';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';

@Component({
  selector: 'app-security-topbar',
  standalone: true,
  imports: [SplitButtonComponent],
  templateUrl: './topbar.component.html'
})
export class SecurityTopbarComponent {

  items: MenuItem[] = [];

  theme: string = ''

  constructor(public themeService: ThemeService, @Inject(DOCUMENT) private document: Document) {
    this.configMenuItems();
  }

  updateThemeText() {
    const element = this.document.querySelector('html')?.classList;
    this.theme = 'Claro';
    if(element?.length == 0) this.theme = 'Oscuro';
    this.configMenuItems();
  }

  configMenuItems() {
    const element = this.document.querySelector('html')?.classList;
    this.theme = 'Claro';
    if(element?.length == 0) this.theme = 'Oscuro';
    
    this.items = [
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
      {
        label: 'Ayuda y soporte',
        icon: 'pi pi-fw pi-question-circle',
        command: () => { } 
      }
    ];
  }

}
