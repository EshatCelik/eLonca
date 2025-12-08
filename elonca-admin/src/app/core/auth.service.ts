import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);

  private readonly apiBase = 'https://localhost:7145/api/Auth';
  private readonly tokenKey = 'auth_token';
  private readonly tenantIdKey = 'tenant_id';

  readonly isAuthenticated = this._isAuthenticated;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    const token = this.getToken();
    this._isAuthenticated.set(!!token);
  }

  login(userName: string, password: string) {
    const body = {
      email: '',
      userName,
      password,
      tenantId: '',
      ipAddress: ''
    };

    return this.http.post<any>(`${this.apiBase}/Login`, body).pipe(
      tap((response) => {
        const token =
          response?.token ||
          response?.accessToken ||
          response?.data?.token ||
          response?.data?.accessToken ||
          response?.result?.token ||
          response?.result?.accessToken;

        if (response?.isSuccess && token) {
          this.setToken(token);
          const tenantId = response?.tenantId ?? response?.data?.tenantId ?? response?.result?.tenantId;
          if (tenantId) this.setTenantId(tenantId);
          this._isAuthenticated.set(true);
        } else {
          this.clearToken();
          this.clearTenantId();
          this._isAuthenticated.set(false);
        }
      }),
      catchError((error) => {
        this.clearToken();
        this.clearTenantId();
        this._isAuthenticated.set(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.clearTenantId();
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  private setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {}
  }

  private clearToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {}
  }

  getTenantId(): string | null {
    try {
      return localStorage.getItem(this.tenantIdKey);
    } catch {
      return null;
    }
  }

  private setTenantId(tenantId: string): void {
    try {
      localStorage.setItem(this.tenantIdKey, tenantId);
    } catch {}
  }

  private clearTenantId(): void {
    try {
      localStorage.removeItem(this.tenantIdKey);
    } catch {}
  }

  registerTenant(payload: any) {
    const body = {
      tenantName: payload.tenantName,
      subdomain: payload.tenantName?.toLowerCase().replace(/\s+/g, '-'),
      connectionString: '',
      status: 1,
      tenantPlan: 1,
      subscriptionEndDate: null,
      maxUser: 10,
      maxStores: 1,
      logoUrl: '',
      tenantEmail: payload.tenantEmail,
      tenantPhone: '',
      userEmail: payload.userEmail,
      userPhone: '',
      userFirsName: payload.userFirsName,
      userLastName: payload.userLastName,
      userName: payload.userName,
      phoneNumber: '',
      password: payload.password,
      passwordConfirm: payload.passwordConfirm,
      userRole: null,
      storeName: `${payload.tenantName} Merkez`,
      storeAddress: '',
      storePhone: '',
      storeEmail: payload.tenantEmail,
      storeTaxNumber: '',
      storeLogoUrl: ''
    };

    return this.http.post(`${this.apiBase}/Register`, body);
  }
}
