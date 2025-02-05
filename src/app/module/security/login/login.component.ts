import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';

import { FormErrors } from '@models/security/security-error.model';
import { LoginRequest } from '@models/security/security-request.model';

import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { ButtonIconPosition } from '@enums/primeng.enum';
import { InputNumberComponent } from "../../../shared/inputs/input-number/input-number.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, DividerModule, RouterModule, ReactiveFormsModule, InputTextComponent, InputPasswordComponent, ButtonComponent, InputNumberComponent],
  templateUrl: './login.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']
})
export class LoginComponent {

  buttonIconPositionRight: ButtonIconPosition = ButtonIconPosition.RIGHT;

  loginForm: FormGroup;
  loginRequest: LoginRequest = new LoginRequest();
  formErrors: FormErrors;

  loginError: boolean = false;
  
  @Output() loginErrorEvent = new EventEmitter<FormErrors>();

  constructor(
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private securityService: SecurityService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * The function initializes a form with two fields, username and password, and applies required and
   * email validators to the username field.
   */
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      accountId: [null, [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  receiveValueString(key: string, value: string) {
    this.loginForm.patchValue({ [key]: value });
  }

  receiveValueNumber(key: string, value: number) {
    this.loginForm.patchValue({ [key]: value });
  }

  /**
   * The function validates a form, retrieves form errors if the form is invalid, and then proceeds to
   * perform a login request.
   * @returns If the loginForm is not valid, the function will return after calling the getFormErrors()
   * function. Otherwise, it will assign the value of the loginForm to the loginRequest variable and
   * call the login() function.
   */
  validateForm() {
    if(!this.loginForm.valid) {
      this.getFormErrors();
      return;
    }

    this.loginRequest = this.loginForm.value;
    this.login();
  }

  /**
   * The function "getFormErrors" retrieves and stores any errors present in the login form controls.
   */
  getFormErrors() {
    this.formErrors = {};
    Object.keys(this.loginForm.controls).forEach(key => {
      const controlErrors = this.loginForm.get(key)?.errors;
      if(!controlErrors) return;
      this.formErrors[key] = [];
      Object.keys(controlErrors).forEach(keyError => this.formErrors[key].push(keyError));
    });
    this.errorEvent();
  }

  /**
   * The login function calls the security service's login method with a login request, saves the
   * session with the returned token, and logs any errors.
   */
  login() {
    this.securityService.login(this.loginRequest).subscribe({
      next: (res) => this.sessionService.saveSession(this.loginRequest, res.data.token),
      error: (error) => {
        if(error.error.error.code === 404) this.loginError = true;
      }
    });
  }

  errorEvent() { this.loginErrorEvent.emit(this.formErrors); }

}
