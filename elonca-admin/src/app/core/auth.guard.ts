import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.checkAuthOnBrowser();
  
  console.log('AuthGuard - Checking authentication...');
  console.log('AuthGuard - isAuthenticated:', authService.isAuthenticated());
  console.log('AuthGuard - Token expired:', authService.isTokenExpired());

  // Check if token exists and is not expired
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    console.log('AuthGuard - Access granted');
    return true;
  }

  // If we get here, either not authenticated or token expired
  console.log('AuthGuard - Redirecting to login');
  
  // Only clear auth data if token is expired
  if (authService.isTokenExpired()) {
    console.log('AuthGuard - Token expired, clearing auth data');
    authService.logout(false); // Don't navigate, we'll handle it here
  }
  
  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  router.navigate(['/login'], { 
    queryParams: { returnUrl: returnUrl } 
  });
  
  return false;
};
