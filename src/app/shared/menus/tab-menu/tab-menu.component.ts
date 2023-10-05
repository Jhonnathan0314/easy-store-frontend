import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
})
export class TabMenuComponent {

  @Input() items: MenuItem[] = [];
  @Input() activeItem: MenuItem;

}
