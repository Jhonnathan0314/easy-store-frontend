import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from 'src/app/core/models/data-types/security/security-error.model';
import { RegisterRequest } from 'src/app/core/models/data-types/security/security-request.model';
import { SecurityService } from 'src/app/core/services/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerRequest: RegisterRequest = new RegisterRequest();
  formErrors: FormErrors;

  @Output() changeViewEvent = new EventEmitter();
  @Output() registerErrorEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private securityService: SecurityService, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  validateForm() {
    if(!this.registerForm.valid || this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this.getFormErrors();
      return;
    }

    this.registerRequest = {
      name: this.registerForm.value.name,
      lastName: this.registerForm.value.lastName,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.register();
  }
  
  getFormErrors() {
    this.formErrors = {};
    Object.keys(this.registerForm.controls).forEach(key => {
      const controlErrors = this.registerForm.get(key)?.errors;
      if(!controlErrors) return;
      this.formErrors[key] = [];
      Object.keys(controlErrors).forEach(keyError => this.formErrors[key].push(keyError));
    });
    this.errorEvent();
  }

  register(){
    this.securityService.register(this.registerRequest).subscribe({
      next: (res) => this.sessionService.saveSession(this.registerRequest, res.data.token),
      error: (error) => console.log("Error en register: ", error)
    });
  }

  changeView() {
    this.changeViewEvent.emit('register');
  }

  errorEvent() { this.registerErrorEvent.emit(this.formErrors); }

}
