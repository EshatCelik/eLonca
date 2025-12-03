import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, NgIf],
  template: `
    <div class="login-wrapper">
      <form class="login-card" (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <h1>Tenant Kayıt</h1>

        <label>
          Firma Adı (TenantName)
          <input
            type="text"
            name="tenantName"
            required
            [(ngModel)]="tenantName"
          />
        </label>

        <label>
          Firma Email (TenantEmail)
          <input
            type="email"
            name="tenantEmail"
            required
            [(ngModel)]="tenantEmail"
          />
        </label>

        <label>
          Kullanıcı Adı (UserName)
          <input
            type="text"
            name="userName"
            required
            [(ngModel)]="userName"
          />
        </label>

        <label>
          Ad
          <input
            type="text"
            name="firstName"
            required
            [(ngModel)]="firstName"
          />
        </label>

        <label>
          Soyad
          <input
            type="text"
            name="lastName"
            required
            [(ngModel)]="lastName"
          />
        </label>

        <label>
          Kullanıcı Email
          <input
            type="email"
            name="userEmail"
            required
            [(ngModel)]="userEmail"
          />
        </label>

        <label>
          Şifre
          <input
            type="password"
            name="password"
            required
            [(ngModel)]="password"
          />
        </label>

        <label>
          Şifre Tekrar
          <input
            type="password"
            name="passwordConfirm"
            required
            [(ngModel)]="passwordConfirm"
          />
        </label>

        <button type="submit" [disabled]="registerForm.invalid">Kayıt Ol</button>
        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
        <p class="info" *ngIf="successMessage">{{ successMessage }}</p>
      </form>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class RegisterComponent {
  tenantName = '';
  tenantEmail = '';
  userName = '';
  firstName = '';
  lastName = '';
  userEmail = '';
  password = '';
  passwordConfirm = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.passwordConfirm) {
      this.errorMessage = 'Şifreler eşleşmiyor.';
      return;
    }

    this.authService
      .registerTenant({
        tenantName: this.tenantName,
        tenantEmail: this.tenantEmail,
        userName: this.userName,
        userFirsName: this.firstName,
        userLastName: this.lastName,
        userEmail: this.userEmail,
        password: this.password,
        passwordConfirm: this.passwordConfirm
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Kayıt başarılı. Giriş ekranına yönlendiriliyorsunuz...';
          setTimeout(() => this.router.navigate(['/login']), 1000);
        },
        error: () => {
          this.errorMessage = 'Kayıt sırasında bir hata oluştu.';
        }
      });
  }
}
