import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent {

  @Input() items: MenuItem[] = [];

}
