import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-mask',
  templateUrl: './input-mask.component.html',
  styleUrls: ['./input-mask.component.css'],
})
export class InputMaskComponent implements OnChanges {
  
  controlValue: FormControl = new FormControl();

  @Input() value: string = '';
  @Input() mask: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter();

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
