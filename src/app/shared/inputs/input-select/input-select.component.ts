import { Component, EventEmitter, Inject, Input, OnChanges, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { Select } from 'primeng/select';
import { DOCUMENT } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-input-select',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabel, Select],
  templateUrl: './input-select.component.html'
})
export class InputSelectComponent implements OnChanges {

  @Input() options: PrimeNGObject[] = [];
  @Input() selectedOption: string = '';
  @Input() label: string = '';
  @Input() classes: string = '';
  @Input() errorMessage: string = '';
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<string>();

  controlValue: FormControl = new FormControl<string>('');

  static nextId = 0;
  componentId: number;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputSelectComponent.nextId++;
  }

  ngOnChanges(): void {
    this.controlValue.setValue(this.selectedOption);
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
