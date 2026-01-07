import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  // Skip interceptor for auth endpoints or if already has Authorization header
  const isAuthEndpoint = /\/Auth\/(Login|Register)/i.test(req.url) || 
                        /\/api\/Auth\/(Login|Register)/i.test(req.url);
  
  if (isAuthEndpoint || req.headers.has('Authorization')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  const tenantId = authService.getTenantId();

  // If no token, continue with the original request
  if (!token) {
    return next(req);
  }

  // Clone the request and add the authorization header
  let newReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`,
      ...(tenantId && { 'X-Tenant-Id': tenantId })
    }
  });

  // Log for debugging
  console.log('Auth Interceptor - Adding headers:', {
    hasToken: !!token,
    hasTenantId: !!tenantId,
    url: req.url
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Auth Interceptor - Error:', error.status, error.message);
      
      // Handle 401 Unauthorized
      if (error.status === 401) {
        console.log('Auth Interceptor - Unauthorized, logging out...');
        authService.logout();
        router.navigate(['/login'], { 
          queryParams: { returnUrl: router.url } 
        });
      }
      
      // Handle 403 Forbidden
      if (error.status === 403) {
        console.log('Auth Interceptor - Access forbidden');
        // You might want to show an access denied message here
      }
      
      return throwError(() => error);
    })
  );
};
