import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from '../../../core/base.component';
import { SwalService } from '../../../core/swal.service';
import { ListsService, CreateListItemRequest } from '../lists.service';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent extends BaseComponent implements OnInit {
  list: any = null;
  isLoading = false;
  isDeleting = false;
  showAddItemModal = false;
  newItem: CreateListItemRequest = {
    ListId: '',
    ProductName: '',
    Price: 0,
    Discount: 0
  };
  isCreatingItem = false;

  // Add getters for storeId and tenantId
  get storeId(): string {
    return this.currentStoreId;
  }

  get tenantId(): string {
    return this.currentTenantId;
  }

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private listsService: ListsService,
    private swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    console.log('ListDetailComponent ngOnInit called');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route ID:', id);
    if (id) {
      this.loadList(id);
    } else {
      console.log('No ID found, redirecting to lists');
      this.router.navigate(['/admin/lists']);
    }
  }

  loadList(id: string): void {
    console.log('loadList called with ID:', id);
    this.isLoading = true;
    this.listsService.getListById(id, this.storeId, this.tenantId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response?.isSuccess && response.data) {
          // Convert listItems to items for template compatibility
          this.list = {
            ...response.data,
            items: response.data.listItems || []
          };
          console.log('List loaded from API:', this.list);
          
          // Load list items separately
          this.loadListItems();
        } else {
          // If API fails, use mock data
          console.log('API failed, using mock data');
          this.list = this.getMockList(id);
          console.log('Mock list loaded:', this.list);
          if (!this.list) {
            this.swalService.error('Liste bulunamadı');
            this.router.navigate(['/admin/lists']);
          }
        }
      },
      error: (error) => {
        console.error('Liste yüklenirken hata oluştu:', error);
        
        // Use mock data on error
        console.log('API hatası, mock veriler kullanılıyor...');
        this.list = this.getMockList(id);
        console.log('Mock list loaded after error:', this.list);
        if (!this.list) {
          this.swalService.error('Liste bulunamadı');
          this.router.navigate(['/admin/lists']);
        }
      }
    });
  }

  // Mock data for development
  private getMockList(id: string): any {
    const mockLists = [
      {
        id: 'mock-1',
        name: 'Alışveriş Listesi',
        description: 'Haftalık alışveriş ihtiyaçları',
        storeId: this.storeId,
        tenantId: this.tenantId,
        isActive: true,
        createdAt: new Date('2025-12-28T10:30:00'),
        items: [
          { id: '1', name: 'Süt', description: '1 litre tam yağlı süt', price: 25.50, quantity: 2, unit: 'litre' },
          { id: '2', name: 'Ekmek', description: 'Taze beyaz ekmek', price: 8.00, quantity: 3, unit: 'adet' },
          { id: '3', name: 'Yumurta', description: '30\'lu yumurta', price: 85.00, quantity: 1, unit: 'paket' }
        ]
      },
      {
        id: 'mock-2',
        name: 'Ofis Malzemeleri',
        description: 'Ofis için gerekli temel malzemeler',
        storeId: this.storeId,
        tenantId: this.tenantId,
        isActive: true,
        createdAt: new Date('2025-12-29T14:15:00'),
        items: [
          { id: '4', name: 'A4 Kağıt', description: '500 yaprak A4 kağıt', price: 150.00, quantity: 2, unit: 'paket' },
          { id: '5', name: 'Kalem', description: 'Mavi tükenmez kalem', price: 12.50, quantity: 10, unit: 'adet' }
        ]
      }
    ];
    
    return mockLists.find(list => list.id === id);
  }

  onEdit(): void {
    if (this.list?.id) {
      this.router.navigate(['/lists', this.list.id, 'edit']);
    }
  }

  onDelete(): void {
    this.swalService.confirm('Bu listeyi silmek istediğinize emin misiniz?').then((result) => {
      if (result.isConfirmed) {
        this.deleteList();
      }
    });
  }

  private deleteList(): void {
    if (!this.list?.id) return;

    this.isDeleting = true;
    this.listsService.deleteList(this.list.id, this.storeId, this.tenantId).pipe(
      finalize(() => {
        this.isDeleting = false;
      })
    ).subscribe({
      next: (response) => {
        if (response?.isSuccess) {
          this.swalService.success('Liste başarıyla silindi').then(() => {
            this.router.navigate(['/lists']);
          });
        } else {
          this.swalService.error(response?.message || 'Liste silinirken bir hata oluştu');
        }
      },
      error: (error) => {
        console.error('Liste silinirken hata oluştu:', error);
        this.swalService.error('Liste silinirken bir hata oluştu');
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/admin/lists']);
  }

  // TrackBy function for better ngFor performance
  trackByItemId(index: number, item: any): string {
    return item.id || index.toString();
  }

  // Calculate total price of all items
  getTotalPrice(): number {
    if (!this.list?.items || this.list.items.length === 0) {
      return 0;
    }
    
    return this.list.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Load list items from API
  loadListItems(): void {
    if (!this.list?.id) return;
    
    this.listsService.getAllListItems(this.list.id, this.storeId, this.tenantId).subscribe({
      next: (response) => {
        if (response?.isSuccess && response.data) {
          this.list.items = response.data;
          console.log('List items loaded:', this.list.items);
        }
      },
      error: (error) => {
        console.error('List items yüklenirken hata:', error);
      }
    });
  }

  // Show add item modal
  showAddItemDialog(): void {
    this.newItem = {
      ListId: this.list.id,
      ProductName: '',
      Price: 0,
      Discount: 0
    };
    this.showAddItemModal = true;
  }

  // Hide add item modal
  hideAddItemDialog(): void {
    this.showAddItemModal = false;
    this.newItem = {
      ListId: '',
      ProductName: '',
      Price: 0,
      Discount: 0
    };
  }

  // Create new list item
  createListItem(): void {
    if (!this.newItem.ProductName || this.newItem.Price <= 0) {
      this.swalService.error('Lütfen ürün adı ve fiyatı giriniz');
      return;
    }

    this.isCreatingItem = true;
    this.listsService.createListItem(this.newItem, this.storeId, this.tenantId).pipe(
      finalize(() => {
        this.isCreatingItem = false;
      })
    ).subscribe({
      next: (response) => {
        if (response?.isSuccess) {
          this.swalService.success('Ürün başarıyla eklendi').then(() => {
            this.hideAddItemDialog();
            this.loadListItems(); // Reload items
          });
        } else {
          this.swalService.error(response?.message || 'Ürün eklenirken hata oluştu');
        }
      },
      error: (error) => {
        console.error('Ürün eklenirken hata:', error);
        this.swalService.error('Ürün eklenirken hata oluştu');
      }
    });
  }
}
