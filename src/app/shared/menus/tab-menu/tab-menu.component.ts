import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';

@Component({
  selector: 'app-tab-menu',
  standalone: true,
  imports: [TabMenuModule],
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
})
export class TabMenuComponent {

  @Input() items: MenuItem[] = [];
  @Input() activeItem: MenuItem;

}
