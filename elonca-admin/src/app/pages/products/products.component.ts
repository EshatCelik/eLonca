import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { SwalService } from '../../core/swal.service';
import { StoresService } from '../stores/stores.service';
import { CategoriesService } from '../categories/categories.service';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  stores: any[] = [];
  categories: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  createModel: any = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    barcode: '',
    sku: '',
    storeId: '',
    categoryId: '',
    isActive: true
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private productsService: ProductsService,
    private swalService: SwalService,
    private readonly storesService: StoresService,
    private readonly categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    console.log('=== ProductsComponent LOADING ===');
    this.loadProducts();
    this.loadStores();
    this.loadCategories();
  }

  loadProducts(): void {
    console.log('=== Loading products ===');
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.productsService.getAll().subscribe({
      next: (data: any) => {
        this.products = Array.isArray(data) ? data : (data?.data || []);
        this.isLoading = false;
        console.log('=== Products loaded ===', this.products);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('=== Products load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStores(): void {
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        this.stores = Array.isArray(data) ? data : (data?.data || []);
        console.log('=== Stores loaded ===', this.stores);
      },
      error: (err: any) => {
        console.error('Stores could not be loaded:', err);
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (data: any) => {
        this.categories = Array.isArray(data) ? data : (data?.data || []);
        console.log('=== Categories loaded ===', this.categories);
      },
      error: (err: any) => {
        console.error('Categories could not be loaded:', err);
      }
    });
  }

  onAddProduct(): void {
    console.log('=== Add product clicked ===');
    this.showCreateModal = true;
    this.createModel = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      barcode: '',
      sku: '',
      storeId: '',
      categoryId: '',
      isActive: true
    };
  }

  createProduct(): void {
    console.log('=== Creating product ===', this.createModel);
    this.isCreating = true;
    
    this.productsService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadProducts();
        this.swalService.success(result.message || 'Ürün başarıyla oluşturuldu.');
      },
      error: (err: any) => {
        console.error('Create error:', err);
        this.isCreating = false;
        this.swalService.error('Hata', 'Ürün oluşturulurken bir hata oluştu.');
      }
    });
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
  }

  onDeleteProduct(product: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete product clicked ===', product);
    
    const productName = product.name || 'Bu ürün';
    const productId = this.getId(product);
    
    if (productId == null) {
      console.error('Product ID not found');
      return;
    }
    
    this.swalService.deleteConfirm(productName).then((result) => {
      if (result.isConfirmed) {
        this.productsService.delete(productId).subscribe({
          next: () => {
            this.swalService.success('Ürün silindi', `${productName} başarıyla silindi.`);
            this.loadProducts();
          },
          error: (err: any) => {
            console.error('Delete error:', err);
            this.swalService.error('Hata', 'Ürün silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  onProductClick(product: any): void {
    console.log('=== Product clicked ===', product);
    const id = this.getId(product);
    if (id != null) {
      this.router.navigate(['/admin/products', id, 'edit']);
    }
  }

  getId(p: any): string | number | null {
    return p?.id ?? p?.productId ?? p?.productID ?? null;
  }

  getStoreName(storeId: string | number): string {
    const store = this.stores.find(s => s.id === storeId);
    return store ? (store.name || store.storeName) : '-';
  }

  getCategoryName(categoryId: string | number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
  }
}
