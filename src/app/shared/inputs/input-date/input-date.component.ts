import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateSelectionMode } from 'src/app/core/models/enums/primeng.enum';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html'
})
export class InputDateComponent implements OnChanges {

  controlValue: FormControl<Date | null>;

  @Input() value: Date | null = new Date();
  @Input() label: string = '';
  @Input() dateFormat: string = '';
  @Input() selectionMode: DateSelectionMode = DateSelectionMode.SINGLE;
  @Input() showButtonBar: boolean = false;
  @Input() showIcon: boolean = false;

  @Output() valueEvent = new EventEmitter<FormControl<Date | null>>();

  /**
   * The ngOnChanges function sets the value of a control and validates its state when changes occur.
   * @param {SimpleChanges} changes - The `changes` parameter is an object of type `SimpleChanges` that
   * contains the changes detected in the input properties of the component. It is used in the
   * `ngOnChanges` lifecycle hook to perform actions based on the changes in the input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
  }

  /**
   * The sendValue function emits the value of the controlValue property.
   */
  sendValue() {
    this.valueEvent.emit(this.controlValue);
  }
}
