import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ReceivablesService } from './receivables.service';
import { CustomersService } from '../customers/customers.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-receivables-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './receivables.component.html',
  styleUrl: './receivables.component.scss'
})
export class ReceivablesComponent implements OnInit, OnDestroy {
  receivables: any[] = [];
  customers: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    customerId: '',
    description: '',
    amount: 0,
    dueDate: ''
  };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly receivablesService: ReceivablesService,
    private readonly customersService: CustomersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      setTimeout(() => {
        if (!this.isLoading) {
          this.load();
          this.loadCustomers();
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

    this.receivablesService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.receivables = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Alacak listesi alınamadı.';
        }
      });
  }

  loadCustomers(): void {
    this.customersService.getAll().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        this.customers = Array.isArray(list) ? list : [];
      },
      error: (err) => {
        console.error('Müşteri listesi alınamadı:', err);
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
    this.createModel = { customerId: '', description: '', amount: 0, dueDate: '' };
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
    this.receivablesService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Alacak başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { customerId: '', description: '', amount: 0, dueDate: '' };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Alacak oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(r: any): void {
    const id = this.getId(r);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.receivablesService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Alacak silinemedi.';
        }
      });
  }

  getId(r: any): string | number | null {
    return r?.id ?? r?.receivableId ?? r?.receivableID ?? null;
  }
}
