import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../core/base.component';
import { SwalService } from '../../core/swal.service';
import { AuthService } from '../../core/auth.service';
import { BaseService } from '../../core/base.service';

interface ChangePasswordCommand {
  userId: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent extends BaseComponent {
  isLoading = false;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  };
  showPasswords = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private swalService: SwalService,
    private authService: AuthService,
    private baseService: BaseService
  ) {
    super(platformId);
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Backend'e gönderilecek model
    const changePasswordCommand: ChangePasswordCommand = {
      userId: this.currentUserId || '',
      currentPassword: this.passwordForm.currentPassword,
      newPassword: this.passwordForm.newPassword,
      newPasswordConfirm: this.passwordForm.newPasswordConfirm
    };

    // Profile/ChangePassword endpoint'ine POST isteği
    this.baseService.post<ApiResponse<any>>('Profile/ChangePassword', changePasswordCommand)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.isSuccess) {
            this.swalService.success('Başarılı', 'Şifreniz başarıyla değiştirildi. Güvenliğiniz için yeniden giriş yapmanız gerekiyor.')
              .then(() => {
                // Şifre değişikliğinden sonra logout yap ve login'e yönlendir
                this.authService.logout();
              });
            this.resetForm();
          } else {
            this.swalService.error('Hata', response.message || 'Şifre değiştirilemedi.');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Password change error:', error);
          
          const errorMessage = error?.error?.message || 
                            error?.error?.errors?.[0] || 
                            'Şifre değiştirilirken bir hata oluştu.';
          
          this.swalService.error('Hata', errorMessage);
        }
      });
  }

  validateForm(): boolean {
    const { currentPassword, newPassword, newPasswordConfirm } = this.passwordForm;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      this.swalService.error('Hata', 'Şifre boş olamaz');
      return false;
    }

    if (currentPassword.length < 5) {
      this.swalService.error('Hata', 'Mevcut şifre en az 5 karakterli olmalı');
      return false;
    }

    if (newPassword.length < 5) {
      this.swalService.error('Hata', 'Yeni şifre en az 5 karakterli olmalı');
      return false;
    }

    if (newPassword !== newPasswordConfirm) {
      this.swalService.error('Hata', 'Şifreler uyuşmuyor');
      return false;
    }

    if (currentPassword === newPassword) {
      this.swalService.error('Hata', 'Yeni şifre mevcut şifreden farklı olmalıdır.');
      return false;
    }

    return true;
  }

  togglePassword(field: 'current' | 'new' | 'confirm'): void {
    this.showPasswords[field] = !this.showPasswords[field];
  }

  resetForm(): void {
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    };
    this.showPasswords = {
      current: false,
      new: false,
      confirm: false
    };
  }

  getPasswordStrength(password: string): { strength: number; text: string; color: string } {
    if (!password) return { strength: 0, text: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: 'Çok Zayıf', color: '#ef4444' },
      { strength: 1, text: 'Zayıf', color: '#f97316' },
      { strength: 2, text: 'Orta', color: '#eab308' },
      { strength: 3, text: 'İyi', color: '#84cc16' },
      { strength: 4, text: 'Güçlü', color: '#22c55e' },
      { strength: 5, text: 'Çok Güçlü', color: '#10b981' }
    ];

    return levels[Math.min(strength, 5)];
  }
}
