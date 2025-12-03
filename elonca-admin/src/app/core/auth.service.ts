import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private readonly router: Router) {}

  login(username: string, password: string): boolean {
    // TODO: Gerçek API entegrasyonu eklendiğinde burası güncellenecek.
    if (username && password) {
      this._isAuthenticated.set(true);
      return true;
    }

    this._isAuthenticated.set(false);
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
