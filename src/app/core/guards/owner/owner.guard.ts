import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/utils/session/session.service';

export const ownerGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // isLogged() valida no solo que exista una sesion, sino que el token no
  // este expirado. Sin esto, un token vencido seguia dejando pasar al guard
  // hasta que una llamada HTTP fallara con 401.
  const role = sessionService.session()?.role;
  if (sessionService.isLogged() && (role === 'owner' || role === 'admin')) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};
