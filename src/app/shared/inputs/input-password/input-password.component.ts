import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [PasswordModule, ReactiveFormsModule],
  templateUrl: './input-password.component.html'
})
export class InputPasswordComponent implements OnChanges {

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() classes: string = '';
  @Input() pattern: string = '';
  @Input() promptLabel: string = '';
  @Input() hasError: boolean = false;
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

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.componentId = InputPasswordComponent.nextId++;
  }

  ngOnChanges(changes: SimpleChanges): void {
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
  }

  /**
   * The function `validateError()` toggles the CSS classes of an element with the id 'inputText' based
   * on the value of the variable `hasError`.
   */
  validateError() {
    if(!this.isValidPassword) {
      this.document.getElementById('inputPassword'+this.componentId)?.classList.replace('ng-valid', 'ng-invalid');
      this.document.getElementById('inputPassword'+this.componentId)?.classList.add('ng-dirty');
    } else {
      this.document.getElementById('inputPassword'+this.componentId)?.classList.replace('ng-invalid', 'ng-valid');
      this.document.getElementById('inputPassword'+this.componentId)?.classList.remove('ng-dirty');
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }
  
}
