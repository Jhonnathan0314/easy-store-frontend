import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-text-area',
  templateUrl: './input-text-area.component.html',
  styleUrls: ['./input-text-area.component.css']
})
export class InputTextAreaComponent implements OnChanges {

  controlValue: FormControl = new FormControl<string>('');

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() rows: number = 0;
  @Input() cols: number = 0;
  @Input() autoResize: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<string>();

  constructor() { }

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
