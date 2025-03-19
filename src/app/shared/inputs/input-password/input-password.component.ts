import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [PasswordModule, FloatLabel, ReactiveFormsModule],
  templateUrl: './input-password.component.html'
})
export class InputPasswordComponent implements OnChanges {

  @Input() value: string = '';
  @Input() label: string = '';
  @Input() classes: string = '';
  @Input() pattern: string = '';
  @Input() promptLabel: string = '';
  @Input() errorMessage: string = '';
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

  ngOnChanges(): void {
    this.controlValue.setValue(this.value);
    this.validateState();
    this.validatePassword();
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
