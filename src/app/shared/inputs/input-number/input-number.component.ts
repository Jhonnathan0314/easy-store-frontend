import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  @Input() isDisabled: boolean = false;
  @Input() hasError: boolean = true;

  @Output() valueEvent = new EventEmitter<number>();

  controlValue: FormControl = new FormControl<number>(this.value);

  static nextId = 0;
  componentId: number;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputNumberComponent.nextId++;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
    this.validateError();
  }

  validateState() {
    if (this.isDisabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  validateError() {
    if(this.hasError) {
      this.document.getElementById('inputNumber'+this.componentId)?.classList.replace('ng-valid', 'ng-invalid');
      this.document.getElementById('inputNumber'+this.componentId)?.classList.add('ng-dirty');
    } else {
      this.document.getElementById('inputNumber'+this.componentId)?.classList.replace('ng-invalid', 'ng-valid');
      this.document.getElementById('inputNumber'+this.componentId)?.classList.remove('ng-dirty');
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }

}
