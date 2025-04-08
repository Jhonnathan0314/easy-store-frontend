import { Component, EventEmitter, Inject, Input, OnChanges, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [InputNumber, IconField, InputIcon, FloatLabel, ReactiveFormsModule],
  templateUrl: './input-number.component.html'
})
export class InputNumberComponent implements OnChanges {

  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() icon: string = '';
  @Input() classes: string = '';
  @Input() errorMessage: string = '';
  @Input() decimalMask: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() valueEvent = new EventEmitter<number>();

  controlValue: FormControl = new FormControl<number>(this.value);

  static nextId = 0;
  componentId: number;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputNumberComponent.nextId++;
  }

  ngOnChanges(): void {
    this.controlValue.setValue(this.value);
    this.validateState();
  }

  validateState() {
    if (this.isDisabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }

}
