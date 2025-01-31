import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent {

  @Input() items: MenuItem[] = [];

}
