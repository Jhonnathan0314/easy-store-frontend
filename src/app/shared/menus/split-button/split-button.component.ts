import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-split-button',
  standalone: true,
  imports: [SplitButtonModule],
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.css'],
})
export class SplitButtonComponent {

  @Input() items: MenuItem[] = [];
  @Input() label: string = '';
  @Input() icon: string = '';

  @Output() actionEvent = new EventEmitter();

}
