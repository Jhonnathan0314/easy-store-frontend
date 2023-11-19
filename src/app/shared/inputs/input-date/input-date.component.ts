import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateSelectionMode } from 'src/app/core/models/enums/primeng.enum';

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
  @Input() selectionMode: DateSelectionMode = DateSelectionMode.SINGLE;
  @Input() showButtonBar: boolean = false;
  @Input() disabled: boolean = false;
  @Input() showIcon: boolean = false;

  @Output() valueEvent = new EventEmitter<Date>();

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
