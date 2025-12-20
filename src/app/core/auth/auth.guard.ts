import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserTypeDto } from '../../../../target/generated-sources';
import { switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};

export const studentRoleGuard: CanActivateFn = (o) => {
  const auth = inject(AuthService);

  return auth.hasAnyRole([UserTypeDto.Student]).pipe(take(1));
};

export const professorRoleGuard: CanActivateFn = (o) => {
  const auth = inject(AuthService);

  return auth.hasAnyRole([UserTypeDto.Professor]).pipe(take(1));
};

export const adminstratorRoleGuard: CanActivateFn = (o) => {
  const auth = inject(AuthService);

  return auth.hasAnyRole([UserTypeDto.Administrator]).pipe(take(1));
};