import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.css'],
})
export class InputPasswordComponent implements OnChanges {

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() classes: string = '';
  @Input() pattern: string = '';
  @Input() promptLabel: string = '';
  @Input() toggleMask: boolean = false;
  @Input() feedback: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<string>();
  
  controlValue: FormControl = new FormControl<string>(this.value);

  isValidPassword: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  hasUppercase: boolean = false;
  hasLowercase: boolean = false;

  static nextId = 0;
  componentId: number;

  constructor() {
    this.componentId = InputPasswordComponent.nextId++;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`Componente iniciado con ID: ${this.componentId}`);
    this.controlValue.setValue(this.value);
    this.validateState();
    this.validatePassword();
    this.validateError();
  }
  
  validateState() {
    if (this.disabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  validatePassword() {
    this.hasNumber = /\d/.test(this.controlValue.value);

    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.controlValue.value);

    this.hasUppercase = /[A-Z]/.test(this.controlValue.value);

    this.hasLowercase = /[a-z]/.test(this.controlValue.value);

    this.isValidPassword =
      this.hasNumber &&
      this.hasSpecialChar &&
      this.hasUppercase &&
      this.hasLowercase &&
      this.controlValue.value.length >= 12 && this.controlValue.value.length <= 24;

    console.log("isValidPassword ", this.isValidPassword);
  }

  /**
   * The function `validateError()` toggles the CSS classes of an element with the id 'inputText' based
   * on the value of the variable `hasError`.
   */
  validateError() {
    if(!this.isValidPassword) {
      document.getElementById('inputPassword'+this.componentId)?.classList.replace('ng-valid', 'ng-invalid');
      document.getElementById('inputPassword'+this.componentId)?.classList.add('ng-dirty');
    } else {
      document.getElementById('inputPassword'+this.componentId)?.classList.replace('ng-invalid', 'ng-valid');
      document.getElementById('inputPassword'+this.componentId)?.classList.remove('ng-dirty');
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }
  
}
