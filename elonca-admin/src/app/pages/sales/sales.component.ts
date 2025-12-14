import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SalesService } from './sales.service';
import { CustomersService } from '../customers/customers.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit, OnDestroy {
  sales: any[] = [];
  customers: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    customerId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0
  };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly salesService: SalesService,
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

    this.salesService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.sales = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Satış listesi alınamadı.';
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
    this.createModel = { customerId: '', productName: '', quantity: 1, unitPrice: 0, totalAmount: 0 };
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
    this.salesService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Satış başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { customerId: '', productName: '', quantity: 1, unitPrice: 0, totalAmount: 0 };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Satış oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(s: any): void {
    const id = this.getId(s);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.salesService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Satış silinemedi.';
        }
      });
  }

  getId(s: any): string | number | null {
    return s?.id ?? s?.saleId ?? s?.saleID ?? null;
  }
}
