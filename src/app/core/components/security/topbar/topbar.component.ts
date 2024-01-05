import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';

@Component({
  selector: 'app-security-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class SecurityTopbarComponent {

  items: MenuItem[] = [];

  constructor(public themeService: ThemeService) {
    this.configMenuItems();
  }

  configMenuItems() {
    this.items = [
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
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
