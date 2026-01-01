import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';
import { ListsService, ProductList } from '../lists/lists.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  productLists: ProductList[] = [];
  selectedStory: ProductList & { isLoading?: boolean; products?: any[] } | null = null;
  selectedStoryId: string = '';
  isLoading = false;
  
  // Store and Tenant IDs - public for template access
  storeId = '';
  tenantId = '';
  
  // Quick Stats
  totalCustomers = 0;
  totalOrders = 0;
  totalRevenue = 0;

  constructor(
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly salesService: SalesService,
    private readonly listsService: ListsService
  ) {
    // localStorage'ı sadece client-side'da eriş
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.storeId = localStorage.getItem('selected_store') || '';
      this.tenantId = localStorage.getItem('tenant_id') || '';
      
      // Eğer store ID boşsa, tenant ID'den al
      if (!this.storeId && this.tenantId) {
        this.storeId = this.tenantId;
      }
    }
  }

  ngOnInit(): void {
    this.loadProductLists();
    this.loadQuickStats();
  }

  loadProductLists(): void {
    this.isLoading = true;
    
    // Gerçek API'den yayınlanmış listeleri getir
    this.listsService.getAllPublishLists(this.storeId, this.tenantId).subscribe({
      next: (response: any) => {
        if (response && response.isSuccess && response.data) {
          this.productLists = response.data;
        } else {
          // API başarısız olursa mock data kullan
          this.productLists = this.getMockLists();
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Yayınlanmış listeler yüklenirken hata:', error);
        // Hata durumunda mock data kullan
        this.productLists = this.getMockLists();
        this.isLoading = false;
      }
    });
  }

  // Mock data fallback
  private getMockLists(): ProductList[] {
    return [
      {
        id: '1',
        name: 'Yeni Sezon Ürünleri',
        description: '2024 Sonbahar Koleksiyonu',
        lastPublishDate: new Date().toISOString(),
        isPublish: true,
        storeId: this.storeId,
        store: null,
        listItems: [],
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
        id: '2', 
        name: 'İndirimli Ürünler',
        description: '%50 ye varan indirimler',
        lastPublishDate: new Date().toISOString(),
        isPublish: true,
        storeId: this.storeId,
        store: null,
        listItems: [],
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
        id: '3',
        name: 'Popüler Ürünler',
        description: 'En çok satanlar',
        lastPublishDate: new Date().toISOString(),
        isPublish: true,
        storeId: this.storeId,
        store: null,
        listItems: [],
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

  loadQuickStats(): void {
    // Mock data - gerçek API'e bağlanılacak
    setTimeout(() => {
      this.totalCustomers = 1234;
      this.totalOrders = 567;
      this.totalRevenue = 890123.45;
    }, 500);
  }

  selectStory(list: ProductList): void {
    if (this.selectedStoryId === list.id) {
      this.closeStoryDetail();
      return;
    }

    this.selectedStoryId = list.id;
    this.selectedStory = { ...list, isLoading: true, products: [] };
    
    // List items'ı API'den getir
    this.listsService.getAllListItems(list.id, list.storeId, list.tenantId).subscribe({
      next: (response) => {
        if (this.selectedStory) {
          this.selectedStory.isLoading = false;
          if (response && response.isSuccess && response.data) {
            this.selectedStory.products = response.data;
          } else {
            // API başarısız olursa mock data kullan
            this.selectedStory.products = this.generateMockProducts(5);
          }
        }
      },
      error: (error) => {
        console.error('List items yüklenirken hata:', error);
        if (this.selectedStory) {
          this.selectedStory.isLoading = false;
          this.selectedStory.products = this.generateMockProducts(5);
        }
      }
    });
  }

  generateMockProducts(count: number): any[] {
    const products = [];
    for (let i = 1; i <= Math.min(count, 10); i++) {
      products.push({
        id: `product-${i}`,
        productName: `Ürün ${i}`,
        name: `Ürün ${i}`, // Fallback
        price: Math.random() * 1000 + 50,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30 + 10) : 0,
        productListId: 'mock-list-id',
        productList: null,
        tenantId: this.tenantId,
        createAt: new Date().toISOString(),
        createdBy: 'mock-user',
        deleteAt: null,
        deletedBy: null,
        updateAt: null,
        updatedBy: null,
        isDeleted: false,
        isActive: true
      });
    }
    return products;
  }

  closeStoryDetail(event?: Event): void {
    if (event && event.target !== event.currentTarget) return;
    
    this.selectedStory = null;
    this.selectedStoryId = '';
  }

  refreshStories(): void {
    this.loadProductLists();
  }

  formatCurrency(amount: number): string {
    if (amount == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  trackByListId(index: number, list: any): string {
    return list.id;
  }

  getDiscountedPrice(product: any): number {
    if (!product.discount || product.discount === 0) {
      return product.price || 0;
    }
    const discountAmount = (product.price * product.discount) / 100;
    return product.price - discountAmount;
  }

  getTotalPrice(): number {
    if (!this.selectedStory?.products) return 0;
    return this.selectedStory.products.reduce((total, product) => {
      return total + this.getDiscountedPrice(product);
    }, 0);
  }

  trackByProductId(index: number, product: any): string {
    return product.id;
  }
}
