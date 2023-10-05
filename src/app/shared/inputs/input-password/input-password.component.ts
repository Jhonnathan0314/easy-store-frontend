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

  controlValue: FormControl = new FormControl<string>('');

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() classes: string = '';
  @Input() pattern: string = '';
  @Input() promptLabel: string = '';
  @Input() toggleMask: boolean = false;
  @Input() feedback: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<string>();

  isValidPassword: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;
  hasUppercase: boolean = false;
  hasLowercase: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
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

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }
  
}
