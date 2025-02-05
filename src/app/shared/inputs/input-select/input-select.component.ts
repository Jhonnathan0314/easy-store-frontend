import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;
  @Input() disabled: boolean = false;
  @Input() hasError: boolean = true;

  @Output() valueEvent = new EventEmitter<string>();

  controlValue: FormControl = new FormControl<string>('');

  static nextId = 0;
  componentId: number;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputSelectComponent.nextId++;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.selectedOption);
    this.validateState();
    this.validateError();
  }

  validateState() {
    if (this.disabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  validateError() {
    if(this.hasError) {
      this.document.getElementById('inputSelect'+this.componentId)?.classList.replace('ng-valid', 'ng-invalid');
      this.document.getElementById('inputSelect'+this.componentId)?.classList.add('ng-dirty');
    } else {
      this.document.getElementById('inputSelect'+this.componentId)?.classList.replace('ng-invalid', 'ng-valid');
      this.document.getElementById('inputSelect'+this.componentId)?.classList.remove('ng-dirty');
    }
  }

  sendValue() { 
    console.log({contro: this.controlValue, value: this.controlValue.value});
    this.valueEvent.emit(this.controlValue.value);
  }

}
