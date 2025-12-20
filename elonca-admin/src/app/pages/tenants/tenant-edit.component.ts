import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantsService } from '../tenants/tenants.service';
import { SwalService } from '../../core/swal.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-tenant-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-edit.component.html',
  styleUrl: './tenant-edit.component.scss'
})
export class TenantEditComponent implements OnInit {
  tenantId: string | null = null;
  isLoading = false;
  isSaving = false;
  tenant: any = {};
  editModel: any = {
    name: '',
    contractEmail: '',
    contractPhone: '',
    tenantPlan: '',
    maxUsers: 0,
    maxStores: 0,
    status: 1
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsService: TenantsService,
    private swalService: SwalService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.tenantId = this.route.snapshot.paramMap.get('id');
    if (this.tenantId) {
      this.loadTenant();
    }
  }

  loadTenant(): void {
    if (!this.tenantId) return;
    
    // SSR'de API çağrısı yapma
    if (!isPlatformBrowser(this.platformId)) {
      console.log('=== Running on server, skipping tenant load ===');
      return;
    }
    
    this.isLoading = true;
    this.cdr.detectChanges(); // Force loading state update
    
    this.tenantsService.getById(this.tenantId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('=== Tenant API Response ===', response);
        
        if (response?.isSuccess && response?.data) {
          this.tenant = response.data;
          console.log('=== Tenant Data ===', this.tenant);
          
          this.editModel = {
            name: this.tenant.name || '',
            contractEmail: this.tenant.contractEmail || '',
            contractPhone: this.tenant.contractPhone || '',
            tenantPlan: this.tenant.tenantPlan?.toString() || '',
            maxUsers: this.tenant.maxUser || this.tenant.maxUsers || 0,
            maxStores: this.tenant.maxStores || 0,
            status: this.tenant.status ?? 1
          };
          
          console.log('=== Edit Model ===', this.editModel);
          this.cdr.detectChanges(); // Force form update
        } else {
          this.swalService.error('Kiracı bilgileri alınamadı');
          this.router.navigate(['/admin/tenants']);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('=== Tenant Load Error ===', error);
        this.cdr.detectChanges(); // Force loading state update
        this.swalService.error('Kiracı bilgileri alınamadı');
        this.router.navigate(['/admin/tenants']);
      }
    });
  }

  onSave(): void {
    if (this.isSaving) return;
    
    this.isSaving = true;
    this.tenantsService.update(this.tenantId!, this.editModel).subscribe({
      next: (response: any) => {
        this.isSaving = false;
        if (response?.isSuccess) {
          this.swalService.success('Kiracı bilgileri güncellendi');
          this.router.navigate(['/admin/tenants']);
        } else {
          this.swalService.error(response?.message || 'Güncelleme başarısız');
        }
      },
      error: (error: any) => {
        this.isSaving = false;
        this.swalService.error('Güncelleme sırasında hata oluştu');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/tenants']);
  }

  onBack(): void {
    this.router.navigate(['/admin/tenants']);
  }

  statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }
}
