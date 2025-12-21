import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { CustomersService } from '../customers.service';
import { SwalService } from '../../../core/swal.service';
import { StoresService } from '../../stores/stores.service';
import { BaseComponent } from '../../../core/base.component';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent extends BaseComponent implements OnInit, AfterViewInit {
  customer: any = null;
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  createModel: any = {};

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customersService: CustomersService,
    private swalService: SwalService,
    private storeService: StoresService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadCustomer();
  }

  ngAfterViewInit(): void {
    // Ensure change detection runs after view is initialized
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  loadCustomer(): void {
    if (this.isLoading) return;
    
    if (!this.isBrowser()) {
      console.log('=== Running on server - skipping customer load ===');
      return;
    }
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.swalService.error('Hata', 'Müşteri ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    
    this.customersService
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
            this.customer = data;
          }
          this.isLoading = false;
          // Force change detection
          this.cdr.detectChanges();
          // Additional force after a small delay
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 50);
        }
      });
  }

  onSave(): void {
    if (this.isSaving || !this.customer) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.customer.id,
      customerCode: this.customer.customerCode,
      storeName: this.customer.storeName,
      customerType: this.customer.customerType,
      discountRate: this.customer.discountRate,
      phone: this.customer.phone,
      email: this.customer.email,
      address: this.customer.address,
      isActive: this.customer.isActive
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

  deleteCustomer(): void {
    if (!this.customer) return;
    
    const customerName = this.customer.storeName || 'Bu müşteri';
    
    this.swalService.deleteConfirm(customerName).then((result: any) => {
      if (result.isConfirmed) {
        this.isDeleting = true;
        
        this.customersService.delete(this.customer.id).subscribe({
          next: () => {
            this.swalService.success('Müşteri silindi', `${customerName} başarıyla silindi.`);
            this.router.navigate(['/admin/customers']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Müşteri silinirken bir hata oluştu.');
            this.isDeleting = false;
          }
        });
      }
    });
  }

  getCustomerType(type: any): string {
    if (type == 1) return "Bireysel";
    else if (type == 2) return "Kurumsal";
    else return type || 'Bireysel';
  }

  onClose(): void {
    this.router.navigate(['/admin/customers']);
  }

  onDelete(): void {
    if (!this.customer) return;
    
    const customerName = `${this.customer.firstName || ''} ${this.customer.lastName || ''}`.trim() || 'Bu müşteri';
    
    this.swalService.deleteConfirm(customerName).then((result: any) => {
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