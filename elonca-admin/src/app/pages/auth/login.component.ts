import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="login-wrapper">
      <form class="login-card" (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <h1>Admin Giriş</h1>
        
        <label>
          E-posta / Kullanıcı Adı
          <input
            type="text"
            name="email"
            required
            [(ngModel)]="email"
            [disabled]="isLoading"
          />
        </label>
        
        <label>
          Şifre
          <input
            type="password"
            name="password"
            required
            [(ngModel)]="password"
            [disabled]="isLoading"
          />
        </label>
        
        <button 
          type="submit" 
          [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
        
        @if (errorMessage) {
        <p class="error">{{ errorMessage }}</p>
        }
        
        <p class="info">
          Hesabın yok mu?
          <a routerLink="/register">Kayıt ol</a>
        </p>
      </form>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  
  errorMessage = '';
  isLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.isLoading = true;

    this.authService
      .login(this.email, this.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);

          if (response?.isSuccess) {
            this.errorMessage = '';
            this.router.navigate(['/admin']);
          } else {
            // Backend'ten gelen mesajı aynen göster
            this.errorMessage = response?.message || 'E-posta veya şifre hatalı.';
          }
        },
        error: (error) => {
          console.log('Login error:', error);

          if (error.status === 0) {
            this.errorMessage = 'Sunucuya bağlanılamıyor. CORS hatası olabilir.';
          } else if (error.status === 401) {
            this.errorMessage = 'E-posta veya şifre hatalı.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Giriş başarısız. Lütfen tekrar deneyin.';
          }
        }
      });
  }
}