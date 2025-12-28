import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { StoresService } from './stores.service';
import { Router } from '@angular/router';
import { SwalService } from '../../core/swal.service';

@Component({
  selector: 'app-stores-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  stores: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  createModel: any = {
    name: '',
    address: '',
    phone: '',
    email: ''
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private storesService: StoresService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    console.log('=== StoresComponent LOADING ===');
    this.loadStores();
  }

  loadStores(): void {
    console.log('=== Loading stores ===');
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        this.stores = Array.isArray(data) ? data : (data?.data || []);
        this.isLoading = false;
        console.log('=== Real stores loaded ===', this.stores);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('=== Stores load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddStore(): void {
    console.log('=== Add store clicked ===');
    this.showCreateModal = true;
    this.createModel = {
      name: '',
      address: '',
      phone: '',
      email: ''
    };
  }

  createStore(): void {
    console.log('=== Creating store ===', this.createModel);
    this.isCreating = true;
    
    this.storesService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadStores();
        this.swalService.success(result.message || 'Mağaza başarıyla oluşturuldu.');
      },
      error: (err) => {
        console.error('Create error:', err);
        this.isCreating = false;
        this.swalService.error('Hata', 'Mağaza oluşturulurken bir hata oluştu.');
      }
    });
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
  }

  onDeleteStore(store: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete store clicked ===', store);
    
    const storeName = store.name || store.storeName || 'Bu mağaza';
    const storeId = this.getId(store);
    
    if (storeId == null) {
      console.error('Store ID not found');
      return;
    }
    
    this.swalService.deleteConfirm(storeName).then((result) => {
      if (result.isConfirmed) {
        this.storesService.delete(storeId).subscribe({
          next: () => {
            this.swalService.success('Mağaza silindi', `${storeName} başarıyla silindi.`);
            this.loadStores();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.swalService.error('Hata', 'Mağaza silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  onStoreClick(store: any): void {
    console.log('=== Store clicked ===', store);
    const id = this.getId(store);
    if (id != null) {
      this.router.navigate(['/admin/stores/edit', id]);
    }
  }

  getId(s: any): string | number | null {
    return s?.id ?? s?.storeId ?? s?.storeID ?? null;
  }
}
