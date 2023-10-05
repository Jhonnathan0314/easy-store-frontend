import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/core/services/security/security.service';
import { ThemeService } from 'src/app/core/services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  
  @Output() changeViewEvent = new EventEmitter();
  @Output() loginEvent = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    public themeService: ThemeService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(24)]]
    });
  }

  validateForm() {
    /* if(!this.loginForm.valid){
      console.log("FORMULARIO LOGIN INVALIDO");
      return;
    }

    console.log("VALID LOGIN FORM"); */
    this.securityService.login();
  }

  changeView() {
    this.changeViewEvent.emit('login');
  }

}
