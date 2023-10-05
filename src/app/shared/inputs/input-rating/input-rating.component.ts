import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-rating',
  templateUrl: './input-rating.component.html',
  styleUrls: ['./input-rating.component.css']
})
export class InputRatingComponent implements OnChanges {

  controlValue: FormControl = new FormControl<number>(0);

  @Input() value: number = 0;
  @Input() cancel: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<number>();

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
