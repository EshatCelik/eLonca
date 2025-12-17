import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: '../login/login.component.scss'
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
        error: (error) => {
          // Backend'den gelen hata mesajını kullan
          this.errorMessage = error?.error?.message || 'Kayıt sırasında bir hata oluştu.';
        }
      });
  }
}
