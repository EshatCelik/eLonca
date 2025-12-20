import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TenantsService } from './tenants.service';
import { SwalService } from '../../core/swal.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tenants-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent implements OnInit, OnDestroy {
  tenants: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  deletingId: string | number | null = null;
  errorMessage = '';
  createMessage = '';
  createSuccess = false;
  createModel: any = {
    name: '',
    contractEmail: '',
    contractPhone: ''
  };
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private tenantsService: TenantsService,
    private swalService: SwalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    console.log('=== TenantsComponent LOADING ===');
    this.loadTenants();
  }

  loadTenants(): void {
    console.log('=== Loading tenants ===');
    
    // SSR'de API çağrısı yapma
    if (!isPlatformBrowser(this.platformId)) {
      console.log('=== Running on server, skipping tenant load ===');
      return;
    }
    
    this.isLoading = true;
    this.cdr.detectChanges();
    
    const subscription = this.tenantsService.getAll().subscribe({
      next: (data: any) => {
        this.tenants = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        this.isLoading = false;
        console.log('=== Tenants loaded ===', this.tenants);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('=== Tenants load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    
    this.subscriptions.push(subscription);
  }

  onAddTenant(): void {
    console.log('=== Add tenant clicked ===');
    this.showCreateModal = true;
    this.createModel = {
      name: '',
      contractEmail: '',
      contractPhone: ''
    };
  }

  onCreateTenant(): void {
    console.log('=== Creating tenant ===', this.createModel);
    this.isCreating = true;
    
    const subscription = this.tenantsService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadTenants();
        this.swalService.success(result.message)
      },
      error: (err) => {
        console.error('Create error:', err);
        this.isCreating = false;
      }
    });
    
    this.subscriptions.push(subscription);
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
  }

  onDeleteTenant(tenant: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete tenant clicked ===', tenant);
    
    const tenantName = tenant.name || tenant.tenantName || 'Bu kiracı';
    
    this.swalService.deleteConfirm(tenantName).then((result) => {
      if (result.isConfirmed) {
        const id = this.getId(tenant);
        if (id != null) {
          this.deletingId = id;
          const subscription = this.tenantsService.delete(id).subscribe({
            next: () => {
              this.swalService.success('Kiracı silindi', `${tenantName} başarıyla silindi.`);
              this.loadTenants();
              this.deletingId = null;
            },
            error: (err) => {
              console.error('Delete error:', err);
              this.swalService.error('Hata', 'Kiracı silinirken bir hata oluştu.');
              this.deletingId = null;
            }
          });
          
          this.subscriptions.push(subscription);
        }
      }
    });
  }

  onTenantClick(tenant: any): void {
    console.log('=== Tenant clicked ===', tenant);
    // Tenant detay/edit sayfasına yönlendirme
    const id = this.getId(tenant);
    if (id != null) {
      this.router.navigate(['/admin/tenants', id, 'edit']);
    }
  }

  statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }

  getId(t: any): string | number | null {
    return t?.id ?? t?.tenantId ?? t?.tenantID ?? null;
  }

  ngOnDestroy(): void {
    // Tüm subscription'ları temizle
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
