import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-split-button',
  standalone: true,
  imports: [SplitButtonModule, Toast],
  templateUrl: './split-button.component.html',
  providers: [MessageService]
})
export class SplitButtonComponent {

  @Input() items: MenuItem[] = [];
  @Input() label: string = '';
  @Input() icon: string = '';

  @Output() actionEvent = new EventEmitter();

}
