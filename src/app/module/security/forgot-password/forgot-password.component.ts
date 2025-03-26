import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';
import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { EmailService } from 'src/app/core/services/api/utils/email/email.service';
import { ResetPasswordRequest } from '@models/security/security-request.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, MessageModule, InputOtpModule, InputTextComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']

})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  request: ResetPasswordRequest = new ResetPasswordRequest();

  timer: number = 60;

  invalidUsername: boolean = false;
  emailSent: boolean = false;
  hasError: boolean = false;
  isWorking: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(6)]],
      code: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    })
  }

  validateUsername() {
    if(this.forgotPasswordForm.controls['username'].invalid) {
      this.invalidUsername = true;
      return;
    }
    this.sendEmail();
  }

  sendEmail() {
    this.emailSent = true;
    this.isWorking = true;
    this.emailService.sendOtpPassword(this.forgotPasswordForm.value.username).subscribe({
      next: () => {
        this.sendEmailInterval();
        this.isWorking = false;
      },
      error: () => {
        this.emailSent = false;
        this.isWorking = false;
      }
    });
  }

  sendEmailInterval() {
    const interval = setInterval(() => {
      this.timer -= 1;
      if(this.timer === 0) {
        this.timer = 60;
        this.emailSent = false;
        clearInterval(interval);
      }
    }, 1000);
  }

  validateForm() {
    if(!this.forgotPasswordForm.valid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.request = {...this.forgotPasswordForm.value};
    this.changePassword();
  }

  changePassword() {
    this.isWorking = true;
    this.securityService.resetPassword(this.request).subscribe({
      next: () => {
        this.successMessage();
        this.isWorking = false;
      },
      error: () => {
        this.hasError = true;
        this.isWorking = false;
      }
    })
  }

  successMessage() {
    this.router.navigateByUrl('/security/login');
  }

  receiveValue(key: string, value: string | number | undefined) {
    this.invalidUsername = false;
    this.forgotPasswordForm.patchValue({ [key]: value });
  }

}
