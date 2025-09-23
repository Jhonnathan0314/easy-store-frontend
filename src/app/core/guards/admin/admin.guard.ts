import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/utils/session/session.service';

export const adminGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = sessionService.session();

  if (session && session.role === 'admin') {
    return true;
  }
  router.navigate(['/home']);
  return false;
};