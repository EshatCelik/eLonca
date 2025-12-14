import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { StoresService } from '../stores.service';

@Component({
  selector: 'app-store-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './store-edit.component.html',
  styleUrl: './store-edit.component.scss'
})
export class StoreEditComponent implements OnInit {
  store: any = null;
  isLoading = false;
  errorMessage = '';
  isSaving = false;
  successMessage = '';

  constructor(
    private readonly storesService: StoresService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadStore();
  }

  loadStore(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Mağaza ID bulunamadı.';
      this.isLoading = false;
      return;
    }

    // API çağrısı
    this.zone.run(() => {
      this.storesService
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
              this.store = data;
            }
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
    });
  }

  onSave(): void {
    if (this.isSaving || !this.store) return;
    
    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Form'daki güncel verileri gönder
    const updateData = {
      id: this.store.id,
      storeName: this.store.storeName,
      address: this.store.address,
      phone: this.store.phone,
      email: this.store.email,
      taxNumber: this.store.taxNumber,
      isActive: this.store.isActive
    };

    this.storesService
      .update(this.store.id, updateData)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Mağaza bilgileri başarıyla güncellendi.';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Mağaza güncellenemedi.';
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/stores']);
  }

  statusLabel(v: any): string {
    if (v === true || v === 'true' || v === 1) return 'Aktif';
    if (v === false || v === 'false' || v === 0) return 'Pasif';
    return v ?? '-';
  }
}
