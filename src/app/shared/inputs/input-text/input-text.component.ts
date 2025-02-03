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
  @Input() hasError: boolean = true;
  @Input() showIcon: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<string>();

  controlValue: FormControl = new FormControl<string>(this.value);

  static nextId = 0;
  componentId: number;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputTextComponent.nextId++;
  }

  /**
   * The ngOnChanges function sets the control value to the current value, and
   * validates the state and error.
   * @param {SimpleChanges} changes - The `changes` parameter is an object of type `SimpleChanges` that
   * contains the changes detected in the input properties of the component. It is used in the
   * `ngOnChanges` lifecycle hook to perform actions based on the changes detected.
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
    this.validateError();
  }

  /**
   * The function checks if the "disabled" property is true and disables the "controlValue" if it is,
   * otherwise it enables it.
   */
  validateState() {
    if (this.disabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  /**
   * The function `validateError()` toggles the CSS classes of an element with the id 'inputText' based
   * on the value of the variable `hasError`.
   */
  validateError() {
    if(this.hasError) {
      this.document.getElementById('inputText'+this.componentId)?.classList.replace('ng-valid', 'ng-invalid');
      this.document.getElementById('inputText'+this.componentId)?.classList.add('ng-dirty');
    } else {
      this.document.getElementById('inputText'+this.componentId)?.classList.replace('ng-invalid', 'ng-valid');
      this.document.getElementById('inputText'+this.componentId)?.classList.remove('ng-dirty');
    }
  }

  /**
   * The sendValue function emits the value of the controlValue property.
   */
  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }

}
