import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { BaseComponent } from '../../core/base.component';
import { StockMovementService } from './stock-movement.service';
import { ProductsService } from '../products/products.service';
import { ProductCompaniesService } from '../product-companies/product-companies.service';
import { SwalService } from '../../core/swal.service';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent extends BaseComponent implements OnInit {
  inventory: any[] = [];
  isLoading = false;
  isSaving = false;
  
  // Modal states
  showAddModal = false;
  showUpdateModal = false;
  showProductSelectModal = false;
  
  // Forms
  selectedProduct: string = '';
  quantity: number = 0;
  operation: 'add' | 'remove' | 'set' = 'add';
  selectedInventoryItem: any = null;
  stockNote: string = '';
  selectedCompany: string = ''; // Firma seçimi için
  
  // Product data
  availableProducts: any[] = [];
  availableCompanies: any[] = []; // Firma listesi
  isLoadingProducts = false; 
  isLoadingCompanies = false; // Firma loading state 

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef,
    private stockMovementService: StockMovementService,
    private productsService: ProductsService,
    private productCompaniesService: ProductCompaniesService,
    private swalService: SwalService,
    private router: Router
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadInventory();
    this.loadAvailableProducts();
    this.loadAvailableCompanies();
  }

  loadInventory(): void {
    if (this.isLoading) return;
    
    if (!this.isBrowser()) return;
    
    this.isLoading = true;

    this.stockMovementService.getAll()
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== Inventory load error ===', err);
          this.swalService.error('Hata', 'Stoklar yüklenirken bir hata oluştu.');
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Inventory API Response ===', response);
          
          if (response?.isSuccess && response?.data) {
            this.inventory = response.data.map((item: any) => ({
              id: item.productId || item.id,
              name: item.productName || item.name || 'Ürün',
              productCode: item.productCode  , 
              movementType: item.movementType || 0,
              stockInQuantity: item.stockInQuantity || 0, 
              stockOutQuantity: item.stockOutQuantity || 0, 
              totalStock:item.stockInQuantity   - item.stockOutQuantity  ,
              minStockLevel: item.minStockLevel || 0,
              productSalePrice: item.productSalePrice || 0,
              productPurchasePrice: item.productPurchasePrice || 0, 
              description: item.notes || '',
              movementDate: item.movementDate
            }));
          } else if (Array.isArray(response)) {
            this.inventory = response.map((item: any) => ({
              id: item.productId || item.id,
              name: item.productName || item.name || 'Ürün',
              productCode: item.productCode  , 
              movementType: item.movementType || 0,
              stockInQuantity: item.stockInQuantity || 0, 
              stockOutQuantity: item.stockOutQuantity || 0, 
              totalStock:item.stockInQuantity  - item.stockOutQuantity  ,
              minStockLevel: item.minStockLevel || 0,
              productSalePrice: item.productSalePrice || 0,
              productPurchasePrice: item.productPurchasePrice || 0, 
              description: item.notes || '',
              movementDate: item.movementDate
            }));
          }
          
          console.log('=== Inventory loaded ===', this.inventory);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== Inventory API error ===', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadAvailableCompanies(): void {
    if (!this.isBrowser()) return;
    
    this.isLoadingCompanies = true;
    
    this.productCompaniesService.getAllProductCompanies({
      tenantId: this.currentTenantId || (this.isBrowser() ? localStorage.getItem('tenant_id') : '') || '',
      storeId: this.currentStoreId || (this.isBrowser() ? localStorage.getItem('selected_store') : '') || ''
    })
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== Companies load error ===', err);
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Available Companies API Response ===', response);
          
          if (response?.isSuccess && response?.data) {
            this.availableCompanies = response.data;
          } else if (Array.isArray(response)) {
            this.availableCompanies = response;
          }
          
          console.log('=== Available companies loaded ===', this.availableCompanies);
          this.isLoadingCompanies = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== Companies API error ===', err);
          this.isLoadingCompanies = false;
          this.cdr.detectChanges();
        }
      });
  }
    
    loadAvailableProducts(): void {
    if (!this.isBrowser()) return;
    
    this.isLoadingProducts = true;
    
    this.productsService.getAll()
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== Products load error ===', err);
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Available Products API Response ===', response);
          
          if (response?.isSuccess && response?.data) {
            this.availableProducts = response.data.map((product: any) => ({
              id: product.id || product.productId,
              name: product.name || product.productName || 'Ürün',
              code: product.code || product.productCode || 'KOD',
              salePrice: product.salePrice || 0,
              purchasePrice: product.purchasePrice || product.costPrice || 0,
              stockQuantity: product.stockQuantity || 0
            }));
          } else if (Array.isArray(response)) {
            this.availableProducts = response.map((product: any) => ({
              id: product.id || product.productId,
              name: product.name || product.productName || 'Ürün',
              code: product.code || product.productCode || 'KOD',
              salePrice: product.salePrice || 0,
              purchasePrice: product.purchasePrice || product.costPrice || 0,
              stockQuantity: product.stockQuantity || 0
            }));
          }
          
          console.log('=== Available products loaded ===', this.availableProducts);
          this.isLoadingProducts = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== Products API error ===', err);
          this.isLoadingProducts = false;
          this.cdr.detectChanges();
        }
      });
  }
  getStockStatus(totalStock: number, minStockLevel: number): { text: string, class: string } {
    if (totalStock <= 0) {
      return { text: 'Stokta Yok', class: 'status-out' };
    } else if (totalStock < minStockLevel && minStockLevel > 0) {
      return { text: 'Kritik Seviye', class: 'status-critical' };
    } else if (totalStock <= minStockLevel * 1.5) {
      return { text: 'Düşük Stok', class: 'status-low' };
    } else if (totalStock <= minStockLevel * 3) {
      return { text: 'Normal Stok', class: 'status-normal' };
    } else {
      return { text: 'Yüksek Stok', class: 'status-high' };
    }
  }
  openAddModal(): void {
    this.showAddModal = true;
    this.resetForm();
  }

  openUpdateModal(item: any): void {
    this.selectedInventoryItem = item;
    this.showUpdateModal = true;
    this.quantity = item.stockQuantity;
  }

  openProductSelectModal(): void {
    this.showProductSelectModal = true;
    this.selectedProduct = '';
    this.quantity = 0;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showUpdateModal = false;
    this.showProductSelectModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedProduct = '';
    this.quantity = 0;
    this.operation = 'add';
    this.selectedInventoryItem = null;
    this.stockNote = '';
  }

  selectProduct(): void {
    if (!this.selectedProduct) return;
    
    const product = this.availableProducts.find(p => p.id === this.selectedProduct);
    if (product) {
      // Check if product already exists in inventory
      const existingItem = this.inventory.find(item => item.id === product.id);
      
      if (existingItem) {
        this.swalService.warning('Uyarı', 'Bu ürün zaten stokta mevcut. Stok güncelleme özelliğini kullanabilirsiniz.');
        this.closeModals();
        return;
      }
      
      // Set selected inventory item with purchase price
      this.selectedInventoryItem = {
        ...product,
        purchasePrice: product.purchasePrice || product.costPrice || 0
      };
      
      this.showProductSelectModal = false;
      this.showAddModal = true;
    }
  }

  addNewProduct(): void {
    if (this.isSaving) return;
    
    if (!this.selectedInventoryItem || !this.quantity || this.quantity <= 0) {
      this.swalService.error('Hata', 'Lütfen ürün seçin ve geçerli bir miktar girin.');
      return;
    }

    if (!this.selectedCompany) {
      this.swalService.error('Hata', 'Lütfen bir firma seçin.');
      return;
    }

    this.isSaving = true;

    const stockData = {
      productId: this.selectedInventoryItem.id,
      productName: this.selectedInventoryItem.name,
      quantity: this.quantity,
      operation: 'add',
      storeId: this.currentStoreId,
      companyId: this.selectedCompany,
      companyName: this.getCompanyName(this.selectedCompany)
    };

    console.log('=== Adding new product to inventory ===', stockData);

    this.stockMovementService.create(stockData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Add product response ===', response);
          
          const newItem = {
            id: this.selectedInventoryItem.id,
            name: this.selectedInventoryItem.name,
            code: this.selectedInventoryItem.code,
            stockQuantity: this.quantity,
            salePrice: this.selectedInventoryItem.salePrice,
            description: this.selectedInventoryItem.description,
            lastUpdated: new Date().toISOString(),
            companyId: this.selectedCompany,
            companyName: this.getCompanyName(this.selectedCompany)
          };
           
          
          this.swalService.success('Başarılı!', `${this.selectedInventoryItem.name} ürünü stoka eklendi.`);
          setTimeout(() => {
            this.closeModals();
            this.loadInventory();
          }, 100);
        },
        error: (err: any) => {
          console.error('=== Add product error ===', err);
          this.swalService.error('Hata!', err?.error?.message || 'Ürün stoka eklenirken bir hata oluştu.');
        }
      });
  }

  updateStock(): void {
    if (this.isSaving) return;
    
    if (!this.selectedInventoryItem || !this.quantity || this.quantity < 0) {
      this.swalService.error('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    if (!this.selectedCompany) {
      this.swalService.error('Hata', 'Lütfen bir firma seçin.');
      return;
    }

    this.isSaving = true;

    const stockData = {
      productId: this.selectedInventoryItem.id,
      quantity: this.quantity, 
      id: this.selectedInventoryItem.id,
      storeId: this.currentStoreId,
      productName: this.selectedInventoryItem.name,
      companyId: this.selectedCompany,
      companyName: this.getCompanyName(this.selectedCompany)
    };

    console.log('=== Updating stock ===', stockData);

    this.stockMovementService.create(stockData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Update stock response ===', response);
          
          const itemIndex = this.inventory.findIndex(item => item.id === this.selectedInventoryItem.id);
          if (itemIndex !== -1) {
            this.inventory[itemIndex].stockQuantity = this.quantity;
            this.inventory[itemIndex].lastUpdated = new Date().toISOString();
            this.inventory[itemIndex].companyId = this.selectedCompany;
            this.inventory[itemIndex].companyName = this.getCompanyName(this.selectedCompany);
          }
          
          this.closeModals();
          this.swalService.success('Başarılı!', `${this.selectedInventoryItem.name} stok miktarı güncellendi.`);
          setTimeout(() => {
            this.loadInventory();
          }, 100);
        },
        error: (err: any) => {
          console.error('=== Update stock error ===', err);
          this.swalService.error('Hata!', err?.error?.message || 'Stok güncellenirken bir hata oluştu.');
        }
      });
  }

  adjustStock(operation: 'add' | 'remove'): void {
    if (this.isSaving) return;
    
    if (!this.selectedInventoryItem || !this.quantity || this.quantity <= 0) {
      this.swalService.error('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    if (!this.selectedCompany) {
      this.swalService.error('Hata', 'Lütfen bir firma seçin.');
      return;
    }

    if (operation === 'remove' && this.selectedInventoryItem.stockQuantity < this.quantity) {
      this.swalService.error('Hata', 'Stokta yeterli ürün yok.');
      return;
    }

    this.isSaving = true;

    const stockData = {
      productId: this.selectedInventoryItem.id,
      storeId: this.currentStoreId,
      quantity: this.quantity,
      Note: this.stockNote,
      productName: this.selectedInventoryItem.name,
      companyId: this.selectedCompany,
      companyName: this.getCompanyName(this.selectedCompany)
    };

    console.log('=== Adjusting stock ===', stockData);

    this.stockMovementService.updateStock(stockData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Adjust stock response ===', response);
          
          this.swalService.success('Başarılı!', `${this.quantity} adet ${this.selectedInventoryItem.name} stoktan çıkarıldı.`).then(() => {
            this.closeModals();
            setTimeout(() => {
              this.loadInventory();
            }, 100);
          });
        },
        error: (err: any) => {
          console.error('=== Adjust stock error ===', err);
          this.swalService.error('Hata!', err?.error?.message || 'Stok işlemi sırasında bir hata oluştu.');
        }
      });
  }

  deleteItem(item: any): void {
    this.swalService.deleteConfirm(item.name).then((result: any) => {
      if (result.isConfirmed) {
        this.stockMovementService.delete(item.id).subscribe({
          next: () => {
            this.inventory = this.inventory.filter(i => i.id !== item.id);
            this.swalService.success('Başarılı!', `${item.name} ürünü stoktan silindi.`);
            this.loadInventory();
          },
          error: (err: any) => {
            this.swalService.error('Hata!', 'Ürün silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  formatCurrency(amount: number): string {
    if (amount == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // getStockStatus(quantity: number): { class: string; text: string } {
  //   if (quantity === 0) {
  //     return { class: 'out-of-stock', text: 'Stokta Yok' };
  //   } else if (quantity <= 10) {
  //     return { class: 'low-stock', text: 'Düşük Stok' };
  //   } else if (quantity <= 50) {
  //     return { class: 'medium-stock', text: 'Normal Stok' };
  //   } else {
  //     return { class: 'high-stock', text: 'Yüksek Stok' };
  //   }
  // }
  getStockInorOutStatus(type: number): { class: string; text: string } {
    if (type === 1) {
      return { class: 'out-of-stock', text: 'Stok Girişi' };
    } else if (type === 2) {
      return { class: 'low-stock', text: 'Stok Çıkışı' };
    } else if (type === 3) {
      return { class: 'medium-stock', text: 'Stok Düzenleme' };
    } else if(type===4) {
      return { class: 'high-stock', text: 'Stoğa Geri Yükleme' };
    }
    else{
      return { class: 'high-stock', text: 'Stok Tipi Bulunamadı' };
    }
  }

  // Helper methods for template
  getInStockCount(): number {
    return this.inventory.filter(item => item.stockInQuantity - item.stockOutQuantity > 0).length;
  }

  getLowStockCount(): number {
    return this.inventory.filter(item => item.stockInQuantity - item.stockOutQuantity <= 10 && item.stockQuantity - item.stockOutQuantity > 0).length;
  }

  getOutOfStockCount(): number {
    return this.inventory.filter(item => item.stockInQuantity - item.stockOutQuantity <= 5).length;
  }

  viewStockDetail(item: any): void {
    if (!item || !item.id) return;
    
    const productId = item.id;
    const storeId = this.currentStoreId || 'default';
    
    this.router.navigate(['/admin/inventory', productId, storeId, 'detail']);
  }

  // Firma adını getiren yardımcı metod
  getCompanyName(companyId: string): string {
    const company = this.availableCompanies.find(c => c.id === companyId);
    return company ? company.name : 'Bilinmeyen Firma';
  }
}
