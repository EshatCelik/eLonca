import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { ProductsService } from '../products.service';
import { StoresService } from '../../stores/stores.service';
import { CategoriesService } from '../../categories/categories.service';
import { SwalService } from '../../../core/swal.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss'
})
export class ProductEditComponent implements OnInit {
  product: any = null;
  stores: any[] = [];
  categories: any[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
    private readonly categoriesService: CategoriesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadCategories();
    this.loadProduct();
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

  loadProduct(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.swalService.error('Hata', 'Ürün ID bulunamadı.');
      this.isLoading = false;
      return;
    }

    this.productsService
      .getById(id)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          this.swalService.error('Hata', 'API isteği zaman aşımına uğradı veya hata oluştu.');
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.product = data;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSave(): void {
    if (this.isSaving || !this.product) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.product.id,
      productName: this.product.productName,
      barcode: this.product.barcode,
      productCode: this.product.productCode,
      purchasePrice: this.product.purchasePrice,
      description: this.product.description,
      salePrice: this.product.salePrice,
      wholesalePrice:this.product.wholesalePrice,
      retailPrice:this.product.retailPrice,
      minStockLevel: this.product.minStockLevel, 
      storeId: this.product.storeId,
      categoryId: this.product.categoryId,
      isActive: this.product.isActive
    };

    this.productsService
      .update(this.product.id, updateData)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.swalService.success('Başarılı!', 'Ürün bilgileri başarıyla güncellendi.');
        },
        error: (err: any) => {
          this.swalService.error('Hata!', err?.error?.message || 'Ürün güncellenemedi.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/products']);
  }

  onDelete(): void {
    if (!this.product) return;
    
    const productName = this.product.name || 'Bu ürün';
    
    this.swalService.deleteConfirm(productName).then((result) => {
      if (result.isConfirmed) {
        this.productsService.delete(this.product.id).subscribe({
          next: () => {
            this.swalService.success('Ürün silindi', `${productName} başarıyla silindi.`);
            this.router.navigate(['/admin/products']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Ürün silinirken bir hata oluştu.');
          }
        });
      }
    });
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
