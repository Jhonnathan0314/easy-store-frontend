import { Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path: '', component: SecurityComponent, children: 
    [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];