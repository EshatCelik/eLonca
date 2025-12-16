import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CustomersService } from './customers.service';
import { StoresService } from '../stores/stores.service';
import { Router } from '@angular/router';
import { SwalService } from '../../core/swal.service';
import { BaseComponent } from '../../core/base.component';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent extends BaseComponent implements OnInit {
  customers: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  createModel: any = {
    storeId: '',
    firstName: '',
    customerType: '',
    discountRate: 0,
    phoneNumber: '',
    email: '',
    address: '',
    userStoreId: '' // Ekleyen kullanıcının store ID'si
  };
  searchQuery = '';
  searchResults: any[] = [];
  isSearching = false;
  selectedStore: any = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customersService: CustomersService,
    private storesService: StoresService,
    private swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    console.log('=== CustomersComponent LOADING ===');
    this.loadCustomers();
    this.setupCurrentUserStoreId();
  }

  setupCurrentUserStoreId(): void {
    this.refreshUserData(); // BaseComponent method
    this.createModel.userStoreId = this.currentStoreId || this.currentTenantId;
    console.log('=== Current user store ID ===', this.createModel.userStoreId);
  }

  loadCustomers(): void {
    console.log('=== Loading customers ===');
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.customersService.getAll().subscribe({
      next: (data: any) => {
        this.customers = Array.isArray(data) ? data : (data?.data || []);
        this.isLoading = false;
        console.log('=== Customers loaded ===', this.customers);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('=== Customers load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddCustomer(): void {
    console.log('=== Add customer clicked ===');
    this.showCreateModal = true;
    this.selectedStore = null;
    this.searchQuery = '';
    this.searchResults = [];
    this.createModel = {
      storeId: '',
      firstName: '',
      customerType: '',
      discountRate: 0,
      phoneNumber: '',
      email: '',
      address: '',
      customerStoreId: this.currentStoreId || this.currentTenantId
    };
  }

  onSearchStores(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.storesService.getAllStoreByName({ storeName: this.searchQuery }).subscribe({
      next: (data: any) => {
        this.searchResults = Array.isArray(data) ? data : (data?.data || []);
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Search error:', err);
        this.searchResults = [];
        this.isSearching = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSelectStore(store: any): void {
    this.selectedStore = store;
    this.searchResults = [];
    this.searchQuery = '';
    
    // Fill createModel with selected store data
    this.createModel = {
      customerStoreId: store.id,
      firstName: store.name || store.storeName,
      customerType: '',
      discountRate: 0,
      phoneNumber: store.phone || '',
      email: store.email || '',
      address: store.address || '',
      storeId: this.currentStoreId ||""
    };
  }

  createCustomer(): void {
    console.log('=== Creating customer ===', this.createModel);
    this.isCreating = true;
    
    this.customersService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadCustomers();
        this.swalService.success(result.message || 'Müşteri başarılya eklendi.');
      },
      error: (err: any) => {
        console.error('Create error:', err);
        this.isCreating = false;
        this.swalService.error('Hata', 'Müşteri eklenirken bir hata oluştu.');
      }
    });
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
    this.selectedStore = null;
    this.searchQuery = '';
    this.searchResults = [];
  }

  onDeleteCustomer(customer: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete customer clicked ===', customer);
    
    const customerName = customer.firstName || 'Bu müşteri';
    const customerId = this.getId(customer);
    
    if (customerId == null) {
      console.error('Customer ID not found');
      return;
    }
    
    this.swalService.deleteConfirm(customerName).then((result) => {
      if (result.isConfirmed) {
        this.customersService.delete(customerId.id).subscribe({
          next: () => {
            this.swalService.success('Müşteri silindi', `${customerName} başarıyla silindi.`);
            this.loadCustomers();
          },
          error: (err: any) => {
            console.error('Delete error:', err);
            this.swalService.error('Hata', 'Müşteri silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  onCustomerClick(customer: any): void {
    console.log('=== Customer clicked ===', customer);
    console.log('=== Customer ID fields ===', {
      id: customer.id,
      customerId: customer.customerId,
      customerID: customer.customerID,
      storeId: customer.storeId
    });
    
    const ids = this.getId(customer);
    console.log('=== Extracted IDs ===', ids);
    
    if (ids != null && ids.storeId && ids.storeCustomerId) { 
      this.router.navigate(['/admin/customers', ids.storeId, ids.storeCustomerId, 'edit']);
    } else {
      console.error('=== No valid customer IDs found ===');
      this.swalService.error('Hata', 'Müşteri ID bulunamadı. Detay sayfasına gidilemiyor.');
    }
  }

  getId(c: any): any | null {
    return {
      id:c.id,
      storeId: c.storeId,
      storeCustomerId: c.customerId
    };
  }

  getCustomerType(type: any): string {
    if (type == 1) return "Bireysel";
    else if (type == 2) return "Kurumsal";
    else return '';
  }
}
