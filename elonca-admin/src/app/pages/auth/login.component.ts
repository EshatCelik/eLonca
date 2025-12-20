import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { BaseComponent } from '../../core/base.component';
import { SwalService } from '../../core/swal.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
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
        
        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
        
        <p class="info">
          Hesabın yok mu?
          <a routerLink="/register">Kayıt ol</a>
        </p>
      </form>
    </div>
  `,
  styleUrl: './login/login.component.scss'
})
export class LoginComponent extends BaseComponent {
  email = '';
  password = '';
  
  errorMessage = '';
  isLoading = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly swalService: SwalService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(platformId);
  }

  onSubmit(): void {
    if (this.isLoading) return;

    console.log('Login attempt - Email:', this.email);
    this.errorMessage = '';
    this.isLoading = true;
    console.log('Loading set to true');

    this.authService
      .login(this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('Login response:', response);
          console.log('Response isSuccess:', response?.isSuccess);
          console.log('Response type:', typeof response?.isSuccess);
          this.isLoading = false;
          console.log('Loading set to false in next');
          this.cdr.detectChanges(); // Force UI update

          if (response && response.isSuccess === true) {
            // Save auth data to localStorage using BaseComponent method
            this.saveCurrentUserToStorage(response.data);
            
            this.errorMessage = '';
            this.router.navigate(['/admin']);
          } else {
            // Backend'ten gelen mesajı butonun üstünde göster
            this.errorMessage = response?.message || 'E-posta veya şifre hatalı.';
            console.log('Error message set:', this.errorMessage);
            this.cdr.detectChanges(); // Force UI update
          }
        },
        error: (error) => {
          console.log('Login error:', error);
          this.isLoading = false;
          console.log('Loading set to false in error');

          if (error.status === 0) {
            this.errorMessage = 'Sunucuya bağlanılamıyor. CORS hatası olabilir.';
          } else if (error.status === 401) {
            this.errorMessage = 'E-posta veya şifre hatalı.';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Giriş başarısız. Lütfen tekrar deneyin.';
          }
          console.log('Error message set:', this.errorMessage);
          this.cdr.detectChanges(); // Force UI update
        }
      });
  }
}