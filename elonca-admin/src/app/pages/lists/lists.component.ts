import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../core/base.component';
import { SwalService } from '../../core/swal.service';
import { ListsService, ProductList } from './lists.service';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TruncatePipe],
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent extends BaseComponent implements OnInit, OnDestroy {
  lists: ProductList[] = [];
  filteredLists: ProductList[] = [];
  isLoading = false;
  errorMessage = '';
  deletingId: string | null = null;
  
  // Filter variables
  searchTerm = '';
  dateFilter = '';
  statusFilter = 'all';

  // Add getters for storeId and tenantId
  get storeId(): string {
    return this.currentStoreId;
  }

  get tenantId(): string {
    return this.currentTenantId;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly listsService: ListsService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadLists();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions if any
  }

  loadLists(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.listsService.getLists(this.storeId, this.tenantId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.isSuccess && response.data) {
            this.lists = response.data;
          } else {
            this.lists = [];
            this.errorMessage = response?.message || 'Listeler yüklenirken bir hata oluştu.';
          }
        },
        error: (error) => {
          console.error('Listeler yüklenirken hata:', error);
          
          // If API fails, use mock data for development
          console.log('API hatası, mock veriler kullanılıyor...');
          this.lists = this.getMockLists();
          this.errorMessage = '';
        }
      });
  }

  // Mock data for development
  private getMockLists(): ProductList[] {
    return [
      {
        id: 'mock-1',
        name: 'Alışveriş Listesi',
        description: 'Haftalık alışveriş listesi',
        lastPublishDate: new Date().toISOString(),
        storeId: this.storeId,
        store: null,
        listItems: [
          { id: '1', name: 'Süt', price: 25, quantity: 2, unit: 'L' },
          { id: '2', name: 'Ekmek', price: 10, quantity: 3, unit: 'Adet' },
          { id: '3', name: 'Yumurta', price: 5, quantity: 12, unit: 'Adet' }
        ],
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: true
      },
      {
        id: 'mock-2',
        name: 'Doğum Günü Partisi',
        description: 'Parti malzemeleri listesi',
        lastPublishDate: new Date().toISOString(),
        storeId: this.storeId,
        store: null,
        listItems: [
          { id: '4', name: 'Pasta', price: 150, quantity: 1, unit: 'Kg' },
          { id: '5', name: 'Mum', price: 20, quantity: 10, unit: 'Adet' },
          { id: '6', name: 'Balon', price: 15, quantity: 20, unit: 'Paket' }
        ],
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: true
      },
      {
        id: 'mock-3',
        name: 'Ofis Malzemeleri',
        description: 'Ofis için gerekli temel malzemeler',
        lastPublishDate: new Date().toISOString(),
        storeId: this.storeId,
        store: null,
        listItems: [
          { id: '7', name: 'Kağıt', price: 30, quantity: 5, unit: 'Paket' },
          { id: '8', name: 'Kalem', price: 5, quantity: 10, unit: 'Adet' },
          { id: '9', name: 'Silgi', price: 3, quantity: 5, unit: 'Adet' }
        ],
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: false
      },
      {
        id: 'mock-4',
        name: 'Bahçe Malzemeleri',
        description: 'Bahçe bakım ürünleri',
        lastPublishDate: new Date().toISOString(),
        storeId: this.storeId,
        store: null,
        listItems: [
          { id: '10', name: 'Gübre', price: 45, quantity: 2, unit: 'Kg' },
          { id: '11', name: 'Saksı', price: 25, quantity: 5, unit: 'Adet' },
          { id: '12', name: 'Toprak', price: 20, quantity: 3, unit: 'Çuval' }
        ],
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: true
      },
      {
        id: 'mock-5',
        name: 'Kamp Malzemeleri',
        description: 'Kamping ekipmanları',
        lastPublishDate: new Date().toISOString(),
        storeId: this.storeId,
        store: null,
        listItems: [
          { id: '13', name: 'Çadır', price: 500, quantity: 1, unit: 'Adet' },
          { id: '14', name: 'Uyku Tulumu', price: 200, quantity: 2, unit: 'Adet' },
          { id: '15', name: 'Fener', price: 50, quantity: 3, unit: 'Adet' }
        ],
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: true
      }
    ];
  }

  onListClick(list: ProductList): void {
    if (list.id) {
      this.router.navigate(['/admin/lists', list.id]);
    }
  }

  createNewList(): void {
    console.log('createNewList called');
    
    // Check if running on browser before accessing window
    if (this.isBrowser()) {
      console.log('Current URL:', window.location.href);
    } else {
      console.log('Running on server - window not available');
    }
    
    console.log('Navigating to /admin/lists/new');
    
    try {
      // Try absolute navigation
      this.router.navigate(['/admin/lists/new']).then(
        (success) => {
          console.log('Navigation successful:', success);
        },
        (error) => {
          console.error('Navigation error:', error);
          console.log('Trying relative navigation...');
          // Fallback to relative navigation
          this.router.navigate(['lists/new']).then(
            (success2) => {
              console.log('Relative navigation successful:', success2);
            },
            (error2) => {
              console.error('Relative navigation error:', error2);
              this.swalService.error('Navigasyon hatası oluştu');
            }
          );
        }
      );
    } catch (error) {
      console.error('Navigation exception:', error);
      this.swalService.error('Navigasyon hatası oluştu');
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.statusFilter = 'all';
  }

  // Helper methods for template
  getActiveListsCount(): number {
    return this.lists.filter(l => l.isActive).length;
  }

  getInactiveListsCount(): number {
    return this.lists.filter(l => !l.isActive).length;
  }

  getTotalItemsCount(): number {
    return this.lists.reduce((total, list) => total + (list.listItems?.length || 0), 0);
  }

  deleteList(listId: string, event: Event): void {
    event.stopPropagation();
    
    this.swalService.confirm('Bu listeyi silmek istediğinize emin misiniz?')
      .then((result: any) => {
        if (result.isConfirmed) {
          this.deletingId = listId;
          this.listsService.deleteList(listId, this.storeId, this.tenantId)
            .subscribe({
              next: (response) => {
                if (response && response.isSuccess) {
                  this.swalService.success('Liste başarıyla silindi.');
                  this.loadLists();
                } else {
                  this.swalService.error(response?.message || 'Liste silinirken bir hata oluştu.');
                }
              },
              error: (error) => {
                console.error('Liste silinirken hata:', error);
                this.swalService.error('Liste silinirken bir hata oluştu.');
              },
              complete: () => {
                this.deletingId = null;
              }
            });
        }
      });
  }

  get filteredListsResult(): ProductList[] {
    let result = [...this.lists];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(list => 
        list.name?.toLowerCase().includes(term) || 
        list.description?.toLowerCase().includes(term)
      );
    }
    
    if (this.dateFilter) {
      // Implement date filtering logic here
    }
    
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      result = result.filter(list => list.isActive === isActive);
    }
    
    return result;
  }

  // TrackBy function for better ngFor performance
  trackByListId(index: number, list: ProductList): string {
    return list.id || index.toString();
  }
}
