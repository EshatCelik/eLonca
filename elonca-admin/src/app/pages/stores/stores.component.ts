import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { StoresService } from './stores.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stores-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit, OnDestroy {
  stores: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly storesService: StoresService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      setTimeout(() => {
        if (!this.isLoading) {
          this.load();
        }
      }, 50);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  load(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.storesService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.stores = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Mağaza listesi alınamadı.';
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
    this.createModel = { name: '', address: '', phone: '', email: '' };
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
    this.storesService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Mağaza başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { name: '', address: '', phone: '', email: '' };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Mağaza oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(s: any): void {
    const id = this.getId(s);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.storesService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Mağaza silinemedi.';
        }
      });
  }

  getId(s: any): string | number | null {
    return s?.id ?? s?.storeId ?? s?.storeID ?? null;
  }
}
