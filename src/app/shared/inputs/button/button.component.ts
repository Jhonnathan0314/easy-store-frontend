import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  @Output() clickEvent = new EventEmitter();

  sendValue($event: any) {
    this.clickEvent.emit($event);
  }
}
