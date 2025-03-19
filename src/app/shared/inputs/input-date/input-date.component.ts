import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateSelectionMode } from 'src/app/core/models/enums/primeng.enum';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-input-date',
  standalone: true,
  imports: [DatePicker, FloatLabel, ReactiveFormsModule],
  templateUrl: './input-date.component.html'
})
export class InputDateComponent implements OnChanges {

  controlValue: FormControl<Date | null>;

  @Input() value: Date | null = new Date();
  @Input() label: string = '';
  @Input() dateFormat: string = '';
  @Input() classes: string = '';
  @Input() errorMessage: string = '';
  @Input() selectionMode: DateSelectionMode = DateSelectionMode.SINGLE;
  @Input() showButtonBar: boolean = false;
  @Input() showIcon: boolean = false;

  @Output() valueEvent = new EventEmitter<FormControl<Date | null>>();

  static nextId = 0;
  componentId: number;

  constructor() {
    this.componentId = InputDateComponent.nextId++;
  }

  ngOnChanges(): void {
    this.controlValue.setValue(this.value);
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue);
  }
}
