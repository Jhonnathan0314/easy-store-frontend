import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';

import { LoginRequest } from '@models/security/security-request.model';

import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { ButtonIconPosition } from '@enums/primeng.enum';
import { MessageModule } from 'primeng/message';

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

  loginError: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private securityService: SecurityService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
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

  validateForm() {
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginRequest = {...this.loginForm.value};
    this.login();
  }

  login() {
    this.securityService.login(this.loginRequest).subscribe({
      next: (res) => this.sessionService.saveSession(this.loginRequest, res.data.token),
      error: () => {
        this.loginError = true;
      }
    });
  }

}
