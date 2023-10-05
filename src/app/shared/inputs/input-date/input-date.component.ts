import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css'],
})
export class InputDateComponent implements OnChanges {
  controlValue: FormControl = new FormControl<Date>(new Date());

  @Input() value: Date = new Date();
  @Input() label: string = '';
  @Input() dateFormat: string = '';
  @Input() selectionMode: string = 'single';
  @Input() showButtonBar: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showIcon: boolean = false;

  @Output() valueEvent = new EventEmitter<Date>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
  }

  validateState() {
    if (this.disabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }
}
