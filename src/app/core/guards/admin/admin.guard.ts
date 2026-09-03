import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/utils/session/session.service';

export const adminGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // isLogged() valida no solo que exista una sesion, sino que el token no
  // este expirado. Sin esto, un token vencido seguia dejando pasar al guard
  // hasta que una llamada HTTP fallara con 401.
  if (sessionService.isLogged() && sessionService.session()?.role === 'admin') {
    return true;
  }
  router.navigate(['/home']);
  return false;
};
