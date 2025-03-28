import { Component, computed, effect, Injector, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';

import { LoginRequest } from '@models/security/security-request.model';

import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { ButtonIconPosition } from '@enums/primeng.enum';
import { MessageModule } from 'primeng/message';
import { ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastModule, MessageModule, DividerModule, RouterModule, ReactiveFormsModule, InputTextComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']
})
export class LoginComponent {

  buttonIconPositionRight: ButtonIconPosition = ButtonIconPosition.RIGHT;

  loginForm: FormGroup;
  loginRequest: LoginRequest = new LoginRequest();

  securityError: Signal<ErrorMessage | null> = computed(() => this.securityService.securityError());

  loginError: boolean = false;
  isWorking: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private injector: Injector,
    public themeService: ThemeService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.validateSecurityError();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  validateSecurityError() {
    effect(() => {
      if(this.securityError() == null) {
        this.loginError = false;
        return;
      }
      this.loginError = true;
      this.isWorking = false;
    }, {injector: this.injector})
  }

  validateForm() {
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginRequest = {...this.loginForm.value};
    this.login();
  }

  login() {
    this.isWorking = true;
    this.securityService.login(this.loginRequest);
  }

  receiveValue(key: string, value: string) {
    this.loginForm.patchValue({ [key]: value });
  }

}
