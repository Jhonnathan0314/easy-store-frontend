import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [InputTextModule, IconField, InputIcon, FloatLabel, ReactiveFormsModule],
  templateUrl: './input-text.component.html'
})
export class InputTextComponent implements OnChanges {

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() showIcon: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() classes: string = '';
  @Input() errorMessage: string = '';

  @Output() valueEvent = new EventEmitter<string>();

  controlValue: FormControl = new FormControl<string>(this.value);

  static nextId = 0;
  componentId: number;

  constructor() {
    this.componentId = InputTextComponent.nextId++;
  }

  ngOnChanges(changes: SimpleChanges): void {
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
