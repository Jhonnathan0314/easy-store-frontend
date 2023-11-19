import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from 'src/app/core/models/data-types/security/security-error.model';
import { LoginRequest } from 'src/app/core/models/data-types/security/security-request.model';
import { SecurityService } from 'src/app/core/services/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginRequest: LoginRequest = new LoginRequest();
  formErrors: FormErrors;
  
  @Output() changeViewEvent = new EventEmitter();
  @Output() loginErrorEvent = new EventEmitter();

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
      password: ['', [Validators.required]]
    });
  }

  validateForm() {
    if(!this.loginForm.valid) {
      this.getFormErrors();
      return;
    }

    this.loginRequest = this.loginForm.value;
    this.login();
  }

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

  login() {
    this.securityService.login(this.loginRequest).subscribe({
      next: (res) => this.sessionService.saveSession(this.loginRequest, res.data.token),
      error: (error) => console.log("Error en login: ", error)
    });
  }

  changeView() { this.changeViewEvent.emit('login'); }

  errorEvent() { this.loginErrorEvent.emit(this.formErrors); }

}
