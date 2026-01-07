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
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuth();
      console.log('Browser - Auth initialized');
    } else {
      console.log('Running on server - skipping auth initialization');
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
    
    if (token) {
      this.ensureTenantContext();
      this._isAuthenticated.set(true);
      console.log('User authenticated from stored token');
    } else {
      this._isAuthenticated.set(false);
      console.log('No token found - user not authenticated');
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
        const token = this.extractToken(response);
        if (response?.isSuccess && token) {
          this.setToken(token);
          const tenantId = this.extractTenantId(response);
          if (tenantId) {
            this.setTenantId(tenantId);
          }
          this._isAuthenticated.set(true);
          console.log('Login successful, tenant ID:', tenantId);
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

  private extractToken(response: any): string | null {
    return response?.token || 
           response?.accessToken || 
           response?.data?.token || 
           response?.data?.accessToken || 
           response?.result?.token || 
           response?.result?.accessToken;
  }

  private extractTenantId(response: any): string | null {
    return response?.tenantId || 
           response?.data?.tenantId || 
           response?.result?.tenantId || 
           (response?.data?.user ? response.data.user.tenantId : null);
  }

  ensureTenantContext(): void {
    const token = this.getToken();
    const tenantId = this.getTenantId();
    
    if (token && !tenantId) {
      try {
        const payload = this.parseJwt(token);
        if (payload.tenantId) {
          this.setTenantId(payload.tenantId);
          console.log('Tenant ID set from token:', payload.tenantId);
        }
      } catch (error) {
        console.error('Failed to extract tenantId from token:', error);
      }
    }
  }

  private parseJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
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
      return null;
    }
    
    try {
      const tokenKeys = ['auth_token', 'token', 'access_token', 'jwt_token'];
      let token = null;
      
      for (const key of tokenKeys) {
        token = localStorage.getItem(key);
        if (token) {
          // Standardize the token key
          if (key !== 'auth_token') {
            localStorage.setItem('auth_token', token);
            localStorage.removeItem(key);
          }
          break;
        }
      }
      
      if (token) {
        this.ensureTenantContext();
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private setToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      // Remove any existing tokens to prevent duplicates
      const tokenKeys = ['auth_token', 'token', 'access_token', 'jwt_token'];
      tokenKeys.forEach(key => {
        if (key !== 'auth_token') {
          localStorage.removeItem(key);
        }
      });
      
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  private clearToken(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      const tokenKeys = ['auth_token', 'token', 'access_token', 'jwt_token'];
      tokenKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  getTenantId(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    
    try {
      return localStorage.getItem(this.tenantIdKey);
    } catch (error) {
      console.error('Error getting tenant ID:', error);
      return null;
    }
  }

  private setTenantId(tenantId: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.setItem(this.tenantIdKey, tenantId);
      console.log('Tenant ID set:', tenantId);
    } catch (error) {
      console.error('Error setting tenant ID:', error);
    }
  }

  private clearTenantId(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.removeItem(this.tenantIdKey);
    } catch (error) {
      console.error('Error clearing tenant ID:', error);
    }
  }

  private clearAuthData(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      localStorage.removeItem('authData');
      console.log('Auth data cleared');
    } catch (error) {
      console.error('Error clearing auth data:', error);
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
