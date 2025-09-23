import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../../services/utils/session/session.service';

export const ownerGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const session = sessionService.session();

  if (session && (session.role === 'owner' || session.role === 'admin')) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};