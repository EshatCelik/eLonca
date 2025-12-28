import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { SalesService } from './sales.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../core/base.component';
import { SwalService } from '../../core/swal.service';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent extends BaseComponent implements OnInit, OnDestroy {
  sales: any[] = [];
  isLoading = false;
  errorMessage = '';
  deletingId: string | number | null = null;
  private routerSubscription?: Subscription;
  
  // Filtre değişkenleri
  searchTerm = '';
  dateFilter = '';
  customerFilter = '';
  statusFilter = '';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly salesService: SalesService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    console.log('=== SalesComponent LOADING ===');
    this.setupCurrentUserStoreId();
    this.load();
    
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

  setupCurrentUserStoreId(): void {
    this.refreshUserData();
    
    let tenantId = null;
    if (this.isBrowser()) {
      try {
        tenantId = localStorage.getItem('tenant_id');
        console.log('=== Sales - Tenant ID from localStorage ===', tenantId);
      } catch (error) {
        console.log('=== Sales - localStorage access failed ===', error);
      }
    } else {
      console.log('=== Sales - Running on server - localStorage not available ===');
    }
    
    console.log('=== Sales - Current store ID ===', this.currentStoreId || tenantId || this.currentTenantId);
  }

  load(): void {
    console.log('=== Loading sales ===');
    
    if (!this.isBrowser()) {
      console.log('=== Sales - Running on server - skipping sales load ===');
      return;
    }
    
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    const model = {
      storeId: this.currentStoreId
    };
    
    console.log('=== Sales - Loading with store ID ===', model);

    this.salesService
      .getAll(model)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== Sales load error ===', err);
          this.errorMessage = 'Satış listesi alınamadı. API hatası.';
          this.cdr.detectChanges();
          return of([]);
        })
      )
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.sales = Array.isArray(list) ? list : [];
          this.isLoading = false;
          console.log('=== Sales loaded ===', this.sales);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== Sales load error ===', err);
          this.errorMessage = err?.error?.message || 'Satış listesi alınamadı.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  get filteredSales(): any[] {
    return this.sales.filter(sale => {
      const matchesSearch = !this.searchTerm || 
        sale.productName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sale.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDate = !this.dateFilter || 
        sale.saleDate?.startsWith(this.dateFilter);
      
      const matchesCustomer = !this.customerFilter || 
        sale.customerName === this.customerFilter;
      
      const matchesStatus = !this.statusFilter || 
        sale.status === this.statusFilter;
      
      return matchesSearch && matchesDate && matchesCustomer && matchesStatus;
    });
  }

  get uniqueCustomers(): string[] {
    return [...new Set(this.sales.map(sale => sale.customerName).filter(name => name))];
  }

  statusLabel(v: any): string {
    if (v === 1  ) return 'Nakit';
    if (v === 2  ) return 'Kredi Kartı';
    if (v === 3  ) return 'Banka Havale';
    if (v === 4  ) return 'Kredi';
    if (v === 5  ) return 'Borç'; 
    return v ?? '-';
  }

  testClick(): void {
    console.log('=== Test click worked! ===');
  }

  onSaleClick(sale: any): void {
    console.log('=== Sale clicked ===', sale);
    const id = this.getId(sale);
    console.log('=== Sale ID extracted ===', id);
    
    if (id == null) {
      console.log('=== Sale ID is null ===');
      this.swalService.error('Hata', 'Satış ID bulunamadı. Detay sayfasına gidilemiyor.');
      return;
    }
    
    console.log('=== Navigating to edit page ===', `/admin/sales/edit/${id}`);
    
    if (this.isBrowser()) {
      this.router.navigate(['/admin/sales/edit', id]);
    }
  }

  onEdit(sale: any): void {
    this.onSaleClick(sale);
  }

  onDelete(s: any): void {
    const id = this.getId(s);
    if (id == null || this.deletingId != null) return;
    
    const saleInfo = s?.productName || `Satış #${id}`;
    
    this.swalService.deleteConfirm(saleInfo).then((result: any) => {
      if (result.isConfirmed) {
        this.deletingId = id;
        this.salesService
          .delete(id)
          .pipe(
            timeout(10000),
            finalize(() => (this.deletingId = null))
          )
          .subscribe({
            next: () => {
              this.swalService.success('Satış silindi', `${saleInfo} başarıyla silindi.`);
              this.load();
            },
            error: (err: any) => {
              this.errorMessage = err?.error?.message || 'Satış silinemedi.';
              this.swalService.error('Hata', 'Satış silinemedi.');
            }
          });
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.customerFilter = '';
    this.statusFilter = '';
  }

  getId(s: any): string | number | null {
    return s?.id ?? s?.saleId ?? s?.saleID ?? null;
  }
}
