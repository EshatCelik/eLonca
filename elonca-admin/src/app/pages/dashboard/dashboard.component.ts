import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';
import { SalesService } from '../sales/sales.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  productLists: any[] = [];
  selectedStory: any = null;
  selectedStoryId: string = '';
  isLoading = false;
  
  // Quick Stats
  totalCustomers = 0;
  totalOrders = 0;
  totalRevenue = 0;

  constructor(
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.loadProductLists();
    this.loadQuickStats();
  }

  loadProductLists(): void {
    this.isLoading = true;
    
    // Mock data - gerçek API'e bağlanılacak
    setTimeout(() => {
      this.productLists = [
        {
          id: '1',
          name: 'Yeni Sezon Ürünleri',
          productCount: 45,
          description: '2024 Sonbahar Koleksiyonu'
        },
        {
          id: '2', 
          name: 'İndirimli Ürünler',
          productCount: 23,
          description: '%50 ye varan indirimler'
        },
        {
          id: '3',
          name: 'Popüler Ürünler',
          productCount: 67,
          description: 'En çok satanlar'
        },
        {
          id: '4',
          name: 'Stokta Azalanlar',
          productCount: 12,
          description: 'Son 5 ürün'
        },
        {
          id: '5',
          name: 'Yeni Gelenler',
          productCount: 34,
          description: 'Bu hafta yeni eklenenler'
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  loadQuickStats(): void {
    // Mock data - gerçek API'e bağlanılacak
    setTimeout(() => {
      this.totalCustomers = 1234;
      this.totalOrders = 567;
      this.totalRevenue = 890123.45;
    }, 500);
  }

  selectStory(list: any): void {
    if (this.selectedStoryId === list.id) {
      this.closeStoryDetail();
      return;
    }

    this.selectedStoryId = list.id;
    this.selectedStory = { ...list, isLoading: true, products: [] };
    
    // Mock products data
    setTimeout(() => {
      this.selectedStory.products = this.generateMockProducts(list.productCount);
      this.selectedStory.isLoading = false;
    }, 800);
  }

  generateMockProducts(count: number): any[] {
    const products = [];
    for (let i = 1; i <= Math.min(count, 10); i++) {
      products.push({
        id: `product-${i}`,
        name: `Ürün ${i}`,
        description: `Bu ürünün açıklaması ${i}`,
        price: Math.random() * 1000 + 50,
        originalPrice: Math.random() > 0.5 ? Math.random() * 1200 + 100 : null,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30 + 10) : null,
        imageUrl: null,
        stock: Math.floor(Math.random() * 100)
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

  trackByProductId(index: number, product: any): string {
    return product.id;
  }
}
