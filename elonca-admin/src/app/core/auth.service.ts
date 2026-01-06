import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly apiBase = 'https://localhost:7145/api/Auth';
  private readonly tokenKey = 'auth_token';
  private readonly tenantIdKey = 'tenant_id';

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    // Sadece browser'da auth kontrolü yap
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuth();
      console.log('Browser - Auth initialized');
    } else {
      console.log('Running on server - skipping auth initialization');
      // Server'da false olarak başla, browser'da güncellenecek
      this._isAuthenticated.set(false);
    }
  }

  // Browser'da auth kontrolünü tetiklemek için public method
  checkAuthOnBrowser(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Browser auth check triggered');
      this.initializeAuth();
    }
  }

  private initializeAuth(): void {
    const token = this.getToken();
    console.log('Initial auth check - Token exists:', !!token);
    
    // Token varsa authenticated olarak işaretle, yoksa false yap
    if (token) {
      this._isAuthenticated.set(true);
      console.log('User authenticated from stored token');
      console.log('Signal value after set:', this._isAuthenticated());
    } else {
      this._isAuthenticated.set(false);
      console.log('No token found - user not authenticated');
      console.log('Signal value after set:', this._isAuthenticated());
    }
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

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode the token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expires = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      
      return now >= expires;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // If there's an error, assume token is expired
    }
  }

  logout(navigateToLogin: boolean = true): void {
    this.clearToken();
    this.clearTenantId();
    this.clearAuthData();
    this._isAuthenticated.set(false);
    
    if (navigateToLogin) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Running on server - cannot access localStorage');
      return null;
    }
    
    try {
      // Farklı token anahtarlarını dene
      const tokenKeys = ['auth_token', 'token', 'access_token', 'jwt_token'];
      let token = null;
      
      for (const key of tokenKeys) {
        token = localStorage.getItem(key);
        if (token) {
          console.log(`Browser - Token found with key: ${key}`);
          break;
        }
      }
      
      if (!token) {
        console.log('Browser - No token found in localStorage');
      }
      
      return token;
    } catch {
      console.log('Browser - localStorage access failed');
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

  private clearAuthData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    try {
      localStorage.removeItem('authData');
      console.log('AuthData cleared from localStorage');
    } catch (error) {
      console.log('Failed to clear authData:', error);
    }
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
