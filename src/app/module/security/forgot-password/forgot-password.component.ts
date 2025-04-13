import { Component, computed, OnDestroy, OnInit, Signal } from '@angular/core';
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
import { WorkingService } from 'src/app/core/services/utils/working/working.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ToastModule, MessageModule, InputOtpModule, InputTextComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']

})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  forgotPasswordForm: FormGroup;
  request: ResetPasswordRequest = new ResetPasswordRequest();

  timer: number = 60;

  invalidUsername: boolean = false;
  emailSent: boolean = false;
  hasError: boolean = false;
  working: Signal<boolean> = computed(() => this.workingService.working());

  interval: NodeJS.Timeout;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailService: EmailService,
    private securityService: SecurityService,
    private workingService: WorkingService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
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
    this.workingService.setWorking(true);
    this.emailService.sendOtpPassword(this.forgotPasswordForm.value.username).subscribe({
      next: () => {
        this.sendEmailInterval();
        this.workingService.setWorking(false);
      },
      error: () => {
        this.emailSent = false;
        this.workingService.setWorking(false);
      }
    });
  }

  sendEmailInterval() {
    this.interval = setInterval(() => {
      this.timer -= 1;
      if(this.timer === 0) {
        this.timer = 60;
        this.emailSent = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  validateForm() {
    if(!this.forgotPasswordForm.valid || !this.arePasswordEquals()) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    this.request = {...this.forgotPasswordForm.value};
    this.changePassword();
  }

  changePassword() {
    this.workingService.setWorking(true);
    this.securityService.resetPassword(this.request).subscribe({
      next: () => {
        this.successMessage();
        this.workingService.setWorking(false);
      },
      error: () => {
        this.hasError = true;
        this.workingService.setWorking(false);
      }
    })
  }
  
  arePasswordEquals() {
    return this.forgotPasswordForm.value.password == this.forgotPasswordForm.value.confirmPassword;
  }

  successMessage() {
    this.router.navigateByUrl('/security/login');
  }

  receiveValue(key: string, value: string | number | undefined) {
    this.invalidUsername = false;
    this.forgotPasswordForm.patchValue({ [key]: value });
  }

}
