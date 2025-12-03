import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-wrapper">
      <form class="login-card" (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <h1>Admin Giriş</h1>
        <label>
          Kullanıcı Adı
          <input
            type="text"
            name="username"
            required
            [(ngModel)]="username"
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
        <button type="submit" [disabled]="loginForm.invalid">Giriş Yap</button>
        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    const success = this.authService.login(this.username, this.password);

    if (success) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Kullanıcı adı veya şifre hatalı.';
    }
  }
}
