import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailModalComponent } from '../../shared/components/detail-modal/detail-modal.component';
import { CustomersService } from './customers.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit, OnDestroy {
  customers: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    name: '',
    taxNumber: '',
    phone: '',
    email: '',
    address: ''
  };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly customersService: CustomersService,
    private readonly router: Router,
    private modalService: NgbModal
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

    this.customersService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.customers = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Müşteri listesi alınamadı.';
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
    this.createModel = { name: '', taxNumber: '', phone: '', email: '', address: '' };
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
    this.customersService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Müşteri başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { name: '', taxNumber: '', phone: '', email: '', address: '' };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Müşteri oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(c: any): void {
    const id = this.getId(c);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.customersService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Müşteri silinemedi.';
        }
      });
  }

  getId(c: any): string | number | null {
    return c?.id ?? c?.customerId ?? c?.customerID ?? null;
  }

  onRowClick(customer: any, event?: MouseEvent): void {
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
    
    modalRef.componentInstance.title = 'Müşteri Detayları';
    modalRef.componentInstance.data = customer;
  }
}
