import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { SalesService } from '../sales.service';
import { CustomersService } from '../../customers/customers.service';
import { SwalService } from '../../../core/swal.service';
import { BaseComponent } from '../../../core/base.component';

@Component({
  selector: 'app-sale-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sale-edit.component.html',
  styleUrls: ['./sale-edit.component.scss']
})
export class SaleEditComponent extends BaseComponent implements OnInit {
  sale: any = null;
  customers: any[] = [];
  isLoading = false;
  isSaving = false;
  createModel: any = {};

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private salesService: SalesService,
    private customersService: CustomersService,
    private swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadSale();
    this.loadCustomers();
  }

  loadSale(): void {
    if (this.isLoading) return;
    
    // SSR'de API çağrısı yapma (SSL certificate sorunu)
    if (!this.isBrowser()) {
      console.log('=== SaleEdit - Running on server - skipping sale load ===');
      return;
    }
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    
    console.log('=== SaleEdit - Route ID ===', id);
    
    if (!id) {
      console.log('=== SaleEdit - ID is null or empty ===');
      this.swalService.error('Hata', 'Satış ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    
    this.salesService
      .getById(id)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          this.swalService.error('Hata', 'API isteği zaman aşımına uğradı veya hata oluştu.');
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.sale = data;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadCustomers(): void {
    if (!this.isBrowser()) {
      console.log('=== SaleEdit - Running on server - skipping customers load ===');
      return;
    }
    
    this.customersService.getAll({}).subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        this.customers = Array.isArray(list) ? list : [];
      },
      error: (err: any) => {
        console.error('Müşteri listesi alınamadı:', err);
      }
    });
  }

  onSave(): void {
    if (this.isSaving || !this.sale) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.sale.id,
      customerId: this.sale.customerId,
      productName: this.sale.productName,
      quantity: this.sale.quantity,
      unitPrice: this.sale.unitPrice,
      totalAmount: this.sale.totalAmount
    };

    this.salesService
      .update(this.sale.id, updateData)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.swalService.success('Başarılı!', 'Satış bilgileri başarıyla güncellendi.');
        },
        error: (err: any) => {
          this.swalService.error('Hata!', err?.error?.message || 'Satış güncellenemedi.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/sales']);
  }

  onDelete(): void {
    if (!this.sale) return;
    
    const saleInfo = this.sale.productName || `Satış #${this.sale.id}`;
    
    this.swalService.deleteConfirm(saleInfo).then((result: any) => {
      if (result.isConfirmed) {
        this.salesService.delete(this.sale.id).subscribe({
          next: () => {
            this.swalService.success('Satış silindi', `${saleInfo} başarıyla silindi.`);
            this.router.navigate(['/admin/sales']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Satış silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  calculateTotal(): void {
    if (this.sale) {
      this.sale.totalAmount = (this.sale.quantity || 0) * (this.sale.unitPrice || 0);
    }
  }
}
