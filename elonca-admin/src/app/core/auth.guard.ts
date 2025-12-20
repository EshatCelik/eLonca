import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard - Checking authentication...');
  console.log('AuthGuard - isAuthenticated:', authService.isAuthenticated());

  // Küçük bir bekleme ile token'ın yüklenmesini sağla
  setTimeout(() => {
    console.log('AuthGuard - After delay - isAuthenticated:', authService.isAuthenticated());
  }, 100);

  if (authService.isAuthenticated()) {
    console.log('AuthGuard - Access granted');
    return true;
  }

  console.log('AuthGuard - Redirecting to login');
  router.navigate(['/login']);
  return false;
};
