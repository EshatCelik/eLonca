import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailModalComponent } from '../../shared/components/detail-modal/detail-modal.component';
import { TenantsService } from './tenants.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tenants-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent implements OnInit, OnDestroy {
  tenants: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
     name: '', 
     contractEmail: '', 
     contractPhone: ''
     };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      // Wait for navigation to complete
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

  onRowClick(tenant: any, event?: MouseEvent): void {
    if (event && (event.target as HTMLElement).closest('button')) {
      return;
    }
    
    event?.preventDefault();
    event?.stopPropagation();
    
    const modalRef = this.modalService.open(DetailModalComponent, { 
      size: 'sm',
      centered: true,
      backdrop: 'static'
    });
    
    modalRef.componentInstance.title = 'Kiracı Detayları';
    modalRef.componentInstance.data = tenant;
  }
}
