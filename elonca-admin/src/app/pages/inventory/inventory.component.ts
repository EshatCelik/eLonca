import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '../../core/base.component';
import { StockMovementService } from './stock-movement.service';
import { SwalService } from '../../core/swal.service';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
  
  // Product data
  availableProducts: any[] = [];
  isLoadingProducts = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private cdr: ChangeDetectorRef,
    private stockMovementService: StockMovementService,
    private swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadInventory();
    this.loadAvailableProducts();
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
              code: item.productCode || item.code || 'KOD',
              stockQuantity: item.stockQuantity || 0,
              salePrice: item.salePrice || 0,
              description: item.description || '',
              lastUpdated: item.lastUpdated || new Date().toISOString()
            }));
          } else if (Array.isArray(response)) {
            this.inventory = response.map((item: any) => ({
              id: item.productId || item.id,
              name: item.productName || item.name || 'Ürün',
              code: item.productCode || item.code || 'KOD',
              stockQuantity: item.stockQuantity || 0,
              salePrice: item.salePrice || 0,
              description: item.description || '',
              lastUpdated: item.lastUpdated || new Date().toISOString()
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

  loadAvailableProducts(): void {
    if (!this.isBrowser()) return;
    
    this.isLoadingProducts = true;
    
    this.stockMovementService.getAvailableProducts()
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
              stockQuantity: product.stockQuantity || 0
            }));
          } else if (Array.isArray(response)) {
            this.availableProducts = response.map((product: any) => ({
              id: product.id || product.productId,
              name: product.name || product.productName || 'Ürün',
              code: product.code || product.productCode || 'KOD',
              salePrice: product.salePrice || 0,
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
      
      this.showProductSelectModal = false;
      this.selectedInventoryItem = product;
      this.showAddModal = true;
    }
  }

  addNewProduct(): void {
    if (this.isSaving) return;
    
    if (!this.selectedInventoryItem || !this.quantity || this.quantity <= 0) {
      this.swalService.error('Hata', 'Lütfen ürün seçin ve geçerli bir miktar girin.');
      return;
    }

    this.isSaving = true;

    const stockData = {
      productId: this.selectedInventoryItem.id,
      quantity: this.quantity,
      operation: 'add'
    };

    console.log('=== Adding new product to inventory ===', stockData);

    this.stockMovementService.updateStock(this.selectedInventoryItem.id, stockData)
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
            lastUpdated: new Date().toISOString()
          };
          
          this.inventory.push(newItem);
          
          this.closeModals();
          this.swalService.success('Başarılı!', `${this.selectedInventoryItem.name} ürünü stoka eklendi.`);
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

    this.isSaving = true;

    const stockData = {
      quantity: this.quantity,
      operation: 'set'
    };

    console.log('=== Updating stock ===', stockData);

    this.stockMovementService.updateStock(this.selectedInventoryItem.id, stockData)
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
          }
          
          this.closeModals();
          this.swalService.success('Başarılı!', `${this.selectedInventoryItem.name} stok miktarı güncellendi.`);
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

    if (operation === 'remove' && this.selectedInventoryItem.stockQuantity < this.quantity) {
      this.swalService.error('Hata', 'Stokta yeterli ürün yok.');
      return;
    }

    this.isSaving = true;

    const stockData = {
      quantity: this.quantity,
      operation: operation
    };

    console.log('=== Adjusting stock ===', stockData);

    this.stockMovementService.updateStock(this.selectedInventoryItem.id, stockData)
      .pipe(
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Adjust stock response ===', response);
          
          const itemIndex = this.inventory.findIndex(item => item.id === this.selectedInventoryItem.id);
          if (itemIndex !== -1) {
            if (operation === 'add') {
              this.inventory[itemIndex].stockQuantity += this.quantity;
            } else {
              this.inventory[itemIndex].stockQuantity -= this.quantity;
            }
            this.inventory[itemIndex].lastUpdated = new Date().toISOString();
          }
          
          this.closeModals();
          const action = operation === 'add' ? 'eklendi' : 'çıkarıldı';
          this.swalService.success('Başarılı!', `${this.quantity} adet ${this.selectedInventoryItem.name} stoktan ${action}.`);
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

  getStockStatus(quantity: number): { class: string; text: string } {
    if (quantity === 0) {
      return { class: 'out-of-stock', text: 'Stokta Yok' };
    } else if (quantity <= 10) {
      return { class: 'low-stock', text: 'Düşük Stok' };
    } else if (quantity <= 50) {
      return { class: 'medium-stock', text: 'Normal Stok' };
    } else {
      return { class: 'high-stock', text: 'Yüksek Stok' };
    }
  }

  // Helper methods for template
  getInStockCount(): number {
    return this.inventory.filter(item => item.stockQuantity > 0).length;
  }

  getLowStockCount(): number {
    return this.inventory.filter(item => item.stockQuantity <= 10 && item.stockQuantity > 0).length;
  }

  getOutOfStockCount(): number {
    return this.inventory.filter(item => item.stockQuantity === 0).length;
  }
}
