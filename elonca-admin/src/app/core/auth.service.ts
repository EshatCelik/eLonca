import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);

  private readonly apiBase = 'https://localhost:7145/api/Auth';

  readonly isAuthenticated = this._isAuthenticated;

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

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
        if (response?.isSuccess) {
          this._isAuthenticated.set(true);
        } else {
          this._isAuthenticated.set(false);
        }
      }),
      catchError((error) => {
        this._isAuthenticated.set(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
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
