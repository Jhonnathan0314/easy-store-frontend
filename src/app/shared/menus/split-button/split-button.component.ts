import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.css'],
})
export class SplitButtonComponent {

  @Input() items: MenuItem[] = [];
  @Input() label: string = '';
  @Input() icon: string = '';

  @Output() actionEvent = new EventEmitter();

  constructor() { }

}
