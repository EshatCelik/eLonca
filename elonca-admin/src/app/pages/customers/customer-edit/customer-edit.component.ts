import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { CustomersService } from '../customers.service';
import { SwalService } from '../../../core/swal.service';
import { StoresService } from '../../stores/stores.service';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnInit {
  customer: any = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private readonly customersService: CustomersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly swalService: SwalService,
    private readonly storeService:StoresService
  ) {}

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;

    const storeId = this.route.snapshot.paramMap.get('storeId');
    const customerStoreId = this.route.snapshot.paramMap.get('customerStoreId');

    if (!storeId) {
      this.swalService.error('Hata', 'Müşteri ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    if (!customerStoreId) {
      this.swalService.error('Hata', 'Müşteri ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    this.customersService
      .getById(storeId,customerStoreId)
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
            this.customer = data;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSave(): void {
    if (this.isSaving || !this.customer) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.customer.id,
      customerCode: this.customer.customerCode,
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      customerType: this.customer.customerType,
      discountRate: this.customer.discountRate,
      phoneNumber: this.customer.phoneNumber,
      email: this.customer.email,
      address: this.customer.address
    };

    this.customersService
      .update(this.customer.id, updateData)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.swalService.success('Başarılı!', 'Müşteri bilgileri başarıyla güncellendi.');
        },
        error: (err: any) => {
          this.swalService.error('Hata!', err?.error?.message || 'Müşteri güncellenemedi.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/customers']);
  }

  onDelete(): void {
    if (!this.customer) return;
    
    const customerName = `${this.customer.firstName || ''} ${this.customer.lastName || ''}`.trim() || 'Bu müşteri';
    
    this.swalService.deleteConfirm(customerName).then((result) => {
      if (result.isConfirmed) {
        this.customersService.delete(this.customer.id).subscribe({
          next: () => {
            this.swalService.success('Müşteri silindi', `${customerName} başarıyla silindi.`);
            this.router.navigate(['/admin/customers']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Müşteri silinirken bir hata oluştu.');
          }
        });
      }
    });
  }
}
