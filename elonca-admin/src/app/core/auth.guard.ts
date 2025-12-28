import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Browser'da auth kontrolünü tetikle
  authService.checkAuthOnBrowser();

  console.log('AuthGuard - Checking authentication...');
  console.log('AuthGuard - isAuthenticated:', authService.isAuthenticated());

  if (authService.isAuthenticated()) {
    console.log('AuthGuard - Access granted');
    return true;
  }

  console.log('AuthGuard - Redirecting to login');
  router.navigate(['/login']);
  return false;
};
