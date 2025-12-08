import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const isAuthEndpoint = /\/Auth\/(Login|Register)/i.test(req.url) || /\/api\/Auth\/(Login|Register)/i.test(req.url);
  if (isAuthEndpoint || req.headers.has('Authorization')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  let newReq = req;
  if (token) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  try {
    const tenantId = localStorage.getItem('tenant_id');
    if (tenantId) {
      newReq = newReq.clone({
        setHeaders: {
          ...newReq.headers.keys().reduce((acc, k) => ({ ...acc, [k]: newReq.headers.get(k) }), {}),
          'X-Tenant-Id': tenantId
        }
      });
    }
  } catch {}

  return next(newReq);
};
