import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { TenantsService } from './tenants.service';

@Component({
  selector: 'app-tenants-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="tenants-page">
      <h1>Tenantlar</h1>

      <div class="toolbar">
        <button type="button" class="btn btn-primary" (click)="toggleCreate()" [disabled]="isCreating">
          Yeni Kiracı
        </button>
        <button type="button" class="btn btn-secondary" (click)="load()" [disabled]="isLoading">
          {{ isLoading ? 'Yükleniyor...' : 'Yenile' }}
        </button>
        @if (errorMessage) {
          <span class="error">{{ errorMessage }}</span>
        }
      </div>

      @if (showCreate) {
        <div class="modal-overlay" (click)="closeCreate()">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Yeni Kiracı Oluştur</h2>
              <button type="button" class="modal-close" (click)="closeCreate()">×</button>
            </div>
            <div class="modal-body">
              <form class="create-form" (ngSubmit)="onCreate()">
                <label>
                  Ad
                  <input type="text" name="name" [(ngModel)]="createModel.name" required />
                </label>
                <label>
                  Email
                  <input type="email" name="contractEmail" [(ngModel)]="createModel.contractEmail" required />
                </label>
                <label>
                  Telefon
                  <input type="text" name="contractPhone" [(ngModel)]="createModel.contractPhone" />
                </label>
                <div class="form-actions">
                  <button type="submit" class="btn btn-primary" [disabled]="isCreating || !createModel.name || !createModel.contractEmail">
                    {{ isCreating ? 'Kaydediliyor...' : 'Ekle' }}
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="closeCreate()" [disabled]="isCreating">
                    İptal
                  </button>
                </div>
              </form>
              @if (createMessage) {
                <div class="modal-message" [class.success]="createSuccess" [class.error]="!createSuccess">
                  {{ createMessage }}
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (!isLoading && tenants.length === 0 && !errorMessage) {
        <p>Gösterilecek tenant bulunamadı.</p>
      }

      @if (tenants.length > 0) {
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Kiracı Ad</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Plan</th>
                <th>Durum</th>
                <th>Maks. Kullanıcı</th>
                <th>Maks. Mağaza</th>
                <th>Bit. Tarihi</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              @for (t of tenants; track $index) {
                <tr>
                  <td>{{ t.name || '-' }}</td>
                  <td>{{ t.contractEmail || '-' }}</td>
                  <td>{{ t.contractPhone || '-' }}</td>
                  <td>{{ t.tenantPlan || '-' }}</td>
                  <td>{{ statusLabel(t.status) }}</td>
                  <td>{{ t.maxUser ?? t.maxUsers ?? '-' }}</td>
                  <td>{{ t.maxStores ?? '-' }}</td>
                  <td>{{ (t.subscriptionEndDate || t.subscriptionEnd) || '-' }}</td>
                  <td>
                    <button type="button" class="btn btn-danger" (click)="onDelete(t)" [disabled]="deletingId === getId(t) || isLoading">
                      {{ deletingId === getId(t) ? 'Siliniyor...' : 'Sil' }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent {
  tenants: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = { name: '', contractEmail: '', contractPhone: '' };
  createMessage = '';
  createSuccess = false;

  constructor(private readonly tenantsService: TenantsService) {
    this.load();
  }

  load(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.tenantsService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.tenants = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Tenant listesi alınamadı.';
        }
      });
  }

  statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }

  toggleCreate(): void {
    if (this.isCreating) return;
    this.showCreate = true;
    this.createMessage = '';
    this.createSuccess = false;
    this.createModel = { name: '', contractEmail: '', contractPhone: '' };
  }

  closeCreate(): void {
    if (this.isCreating) return;
    this.showCreate = false;
    this.createMessage = '';
    this.createSuccess = false;
  }

  onCreate(): void {
    if (this.isCreating) return;
    this.isCreating = true;
    this.tenantsService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Kiracı başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { name: '', contractEmail: '', contractPhone: '' };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Tenant oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(t: any): void {
    const id = this.getId(t);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.tenantsService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Tenant silinemedi.';
        }
      });
  }

  getId(t: any): string | number | null {
    return t?.id ?? t?.tenantId ?? t?.tenantID ?? null;
  }
}
