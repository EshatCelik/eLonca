import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { UsersService } from '../users.service';
import { StoresService } from '../../stores/stores.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  user: any = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;
  successMessage = '';
  stores: any[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone,    
    private readonly storesService: StoresService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadStores();
  }
  loadStores(): void {
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        this.stores = Array.isArray(list) ? list : [];
      },
      error: (err) => {
        console.error('Store listesi alınamadı:', err);
      }
    });
  }
  loadUser(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Kullanıcı ID bulunamadı.';
      this.isLoading = false;
      return;
    }

    // API çağrısı
    this.zone.run(() => {
      this.usersService
        .getById(id)
        .pipe(
          timeout(10000),
          catchError((err) => {
            this.errorMessage = 'API isteği zaman aşımına uğradı veya hata oluştu.';
            this.cdr.detectChanges();
            return of(null);
          })
        )
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.user = data;
            }
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
    });
  }

  onUpdate(): void {
    if (this.isSaving || !this.user) return;
    
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Form'daki güncel verileri gönder
    const updateData = {
      id: this.user.id,
      name: this.user.name,
      lastName:this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      userName:this.user.userName,
      password: this.user.password, // Şifre değiştirilmişse gönder
      userRole: this.user.userRole,
      isActive: this.user.isActive,
      storeId:this.user.storeId
    };

    this.usersService
      .update(this.user.id, updateData)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Kullanıcı bilgileri başarıyla güncellendi.';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Kullanıcı güncellenemedi.';
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/users']);
  }

  statusLabel(v: any): string {
    if (v === true || v === 'true' || v === 1) return 'Aktif';
    if (v === false || v === 'false' || v === 0) return 'Pasif';
    return v ?? '-';
  }
}
