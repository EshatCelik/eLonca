import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { SalesService } from '../sales.service';
import { ProductsService } from '../../products/products.service';
import { SwalService } from '../../../core/swal.service';
import { BaseComponent } from '../../../core/base.component';

@Component({
  selector: 'app-sale-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sale-edit.component.html',
  styleUrls: ['./sale-edit.component.scss']
})
export class SaleEditComponent extends BaseComponent implements OnInit {
  sale: any = null;
  isLoading = false;
  isSaving = false;
  
  // Modal için
  showAddProductModal = false;
  isAddingProduct = false;
  availableProducts: any[] = [];
  newProduct = {
    productId: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    totalPrice: 0
  };

  // Item detay modal için
  showItemDetailModal = false;
  isUpdatingItem = false;
  selectedItem: any = null;
  editItem = {
    id: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    totalPrice: 0
  };

  // İade işlemleri için
  isReturning = false;
  returningItemId: string = '';
  showReturnModal = false;
  selectedReturnItem: any = null;
  returnNote: string = '';
  returnQuantity: number = 1;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private salesService: SalesService,
    private productsService: ProductsService,
    private swalService: SwalService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadSale();
    this.loadAvailableProducts();
  }

  loadSale(): void {
    if (this.isLoading) return;
    
    if (!this.isBrowser()) {
      console.log('=== SaleEdit - Running on server - skipping sale load ===');
      return;
    }
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    
    console.log('=== SaleEdit - Full Route URL ===', window.location.href);
    console.log('=== SaleEdit - Route Snapshot ===', this.route.snapshot);
    console.log('=== SaleEdit - Route Param Map ===', this.route.snapshot.paramMap);
    console.log('=== SaleEdit - Route ID ===', id);
    
    if (!id) {
      console.log('=== SaleEdit - ID is null or empty ===');
      this.swalService.error('Hata', 'Satış ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    
    console.log('=== SaleEdit - Making API call with ID ===', id);
    
    this.salesService
      .getById(id)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== SaleEdit - API Error ===', err);
          this.swalService.error('Hata', 'API isteği zaman aşımına uğradı veya hata oluştu.');
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== SaleEdit - API Response ===', response);
          
          if (response?.isSuccess && response?.data) {
            this.sale = response.data;
            console.log('=== SaleEdit - Sale loaded ===', this.sale);
            
            // İade miktarlarını varsayılan olarak ayarla
            if (this.sale?.saleItems) {
              this.sale.saleItems.forEach((item: any) => {
                item.returnedQuantity = item.returnedQuantity || 0;
              });
            }
          } else {
            console.log('=== SaleEdit - API Response Failed ===', response);
            this.swalService.error('Hata', response?.message || 'Satış bilgileri alınamadı.');
          }
          
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== SaleEdit - API Call Error ===', err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSave(): void {
    if (this.isSaving || !this.sale) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.sale.id,
      invoiceNumber: this.sale.invoiceNumber,
      totalAmount: this.sale.totalAmount,
      paidAmount: this.sale.paidAmount,
      paymentType: this.sale.paymentType,
      paymentStatus: this.sale.paymentStatus,
      notes: this.sale.notes,
      storeId: this.sale.storeId,
      storeCustomerId: this.sale.storeCustomerId,
      saleItems:this.sale.saleItems
    };

    console.log('=== SaleEdit - Updating sale ===', updateData);

    this.salesService
      .update(this.sale.id, updateData)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== SaleEdit - Update response ===', response);
          
          if (response?.isSuccess) {
            this.swalService.success('Başarılı!', 'Satış bilgileri başarıyla güncellendi.');
          } else {
            this.swalService.error('Hata!', response?.message || 'Satış güncellenemedi.');
          }
        },
        error: (err: any) => {
          console.log('=== SaleEdit - Update error ===', err);
          this.swalService.error('Hata!', err?.error?.message || 'Satış güncellenemedi.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/sales']);
  }

  onDelete(): void {
    if (!this.sale) return;
    
    const saleInfo = `Fatura #${this.sale.invoiceNumber || this.sale.id}`;
    
    this.swalService.deleteConfirm(saleInfo).then((result: any) => {
      if (result.isConfirmed) {
        this.salesService.delete(this.sale.id).subscribe({
          next: (response: any) => {
            console.log('=== SaleEdit - Delete response ===', response);
            
            if (response?.isSuccess) {
              this.swalService.success('Satış silindi', `${saleInfo} başarıyla silindi.`);
              this.router.navigate(['/admin/sales']);
            } else {
              this.swalService.error('Hata', response?.message || 'Satış silinemedi.');
            }
          },
          error: (err: any) => {
            console.log('=== SaleEdit - Delete error ===', err);
            this.swalService.error('Hata', 'Satış silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  paymentTypeLabel(paymentType: number): string {
    const types = {
      1: 'Nakit',
      2: 'Kredi Kartı',
      3: 'Banka Havale',
      4: 'Kredi',
      5: 'Borç'
    };
    return types[paymentType as keyof typeof types] || 'Bilinmeyen';
  }

  paymentStatusLabel(paymentStatus: number): string {
    const statuses = {
      1: 'Ödendi',
      2: 'Kısmi Ödeme',
      3: 'Beklemede',
      4: 'İptal Edildi'
    };
    return statuses[paymentStatus as keyof typeof statuses] || 'Bilinmeyen';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }

  formatCurrency(amount: number): string {
    if (amount == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  // Modal method'ları
  loadAvailableProducts(): void {
    if (!this.isBrowser()) return;
    
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
          console.log('=== Products API Response ===', response);
          console.log('=== Response isSuccess ===', response?.isSuccess);
          console.log('=== Response data ===', response?.data);
          
          if (response?.isSuccess && response?.data) {
            this.availableProducts = response.data.map((product: any) => ({
              id: product.id,
              name: product.name || product.productName || 'Ürün',
              code: product.code || product.productCode || 'KOD',
              price: product.salePrice || 0,
              discount:product.discount  // discount yapılacak
            }));
            console.log('=== Available products loaded ===', this.availableProducts);
          } else if (Array.isArray(response)) {
            // Direkt array gelirse
            this.availableProducts = response.map((product: any) => ({
              id: product.id,
              name: product.name || product.productName || 'Ürün',
              code: product.code || product.productCode || 'KOD',
              price: product.salePrice   || 0
            }));
            console.log('=== Available products loaded (array) ===', this.availableProducts);
          }  
        },
        error: (err: any) => {
          console.log('=== Products API error ===', err);
          // Hata olursa geçici data
           
        }
      });
  }

  closeAddProductModal(): void {
    this.showAddProductModal = false;
    this.resetNewProduct();
  }

  resetNewProduct(): void {
    this.newProduct = {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      totalPrice: 0
    };
  }

  onProductSelect(): void {
    const selectedProduct = this.availableProducts.find(p => p.id === this.newProduct.productId);
    if (selectedProduct) {
      this.newProduct.unitPrice = selectedProduct.price;
      this.calculateProductTotal();
    }
  }

  calculateProductTotal(): void {
    const subtotal = this.newProduct.quantity * this.newProduct.unitPrice;
    const discountAmount = subtotal * (this.newProduct.discount / 100);
    this.newProduct.totalPrice = subtotal - discountAmount;
  }

  addProductToSale(): void {
    if (!this.newProduct.productId || this.isAddingProduct) return;
    
    this.isAddingProduct = true;
    
    const selectedProduct = this.availableProducts.find(p => p.id === this.newProduct.productId);
    
    const saleItemPayload = {
      productId: this.newProduct.productId,
      quantity: this.newProduct.quantity,
      unitPrice: this.newProduct.unitPrice,
      discount: this.newProduct.discount,
      totalPrice: this.newProduct.totalPrice
    };
    
    console.log('=== Creating sale item ===', saleItemPayload);
    
    // Direkt veritabanına kaydet
    this.salesService.createSaleItem(this.sale.id, saleItemPayload)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== SaleItem create error ===', err);
          this.swalService.error('Hata!', 'Ürün eklenirken bir hata oluştu.');
          this.isAddingProduct = false;
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== SaleItem create response ===', response);
          
          if (response?.isSuccess && response?.data) {
            // Başarılı olursa satışı yeniden yükle
            this.loadSale();
            this.closeAddProductModal();
            this.swalService.success('Başarılı!', 'Ürün satışa eklendi.');
          } else {
            this.swalService.error('Hata!', response?.message || 'Ürün eklenemedi.');
          }
          
          this.isAddingProduct = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== SaleItem create error ===', err);
          this.swalService.error('Hata!', 'Ürün eklenirken bir hata oluştu.');
          this.isAddingProduct = false;
          this.cdr.detectChanges();
        }
      });
  }

  updateSaleTotal(): void {
    if (this.sale.saleItems && this.sale.saleItems.length > 0) {
      this.sale.totalAmount = this.sale.saleItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
      this.sale.paidAmount = this.sale.totalAmount; // Ödenen tutarı güncelle
      this.sale.remainingAmount = 0;
    }
  }

  // Item detay modal method'ları
  onItemClick(item: any): void {
    this.selectedItem = item;
    this.editItem = {
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount || 0,
      totalPrice: item.totalPrice||0
    };
    this.showItemDetailModal = true;
  }

  closeItemDetailModal(): void {
    this.showItemDetailModal = false;
    this.selectedItem = null;
    this.editItem = {
      id: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      totalPrice: 0
    };
  }

  calculateEditItemTotal(): void {
    const subtotal = this.editItem.quantity * this.editItem.unitPrice;
    const discountAmount = subtotal * (this.editItem.discount / 100);
    this.editItem.totalPrice = subtotal - discountAmount;
  }

  updateSaleItem(): void {
    if (!this.editItem.id || this.isUpdatingItem) return;
    
    this.isUpdatingItem = true;
    
    const updatePayload = {
      quantity: this.editItem.quantity,
      unitPrice: this.editItem.unitPrice,
      discount: this.editItem.discount,
      totalPrice: this.editItem.totalPrice,
      productId:this.selectedItem.productId,
      saleId:this.sale.id
    };
    
    console.log('=== Updating sale item ===', updatePayload);
    
    this.salesService.updateSaleItem(this.editItem.id, updatePayload)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== SaleItem update error ===', err);
          this.swalService.error('Hata!', 'Ürün güncellenirken bir hata oluştu.');
          this.isUpdatingItem = false;
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== SaleItem update response ===', response);
          
          if (response?.isSuccess) {
            // Başarılı olursa satışı yeniden yükle
            this.loadSale();
            this.closeItemDetailModal();
            this.swalService.success('Başarılı!', 'Ürün güncellendi.');
          } else {
            this.swalService.error('Hata!', response?.message || 'Ürün güncellenemedi.');
          }
          
          this.isUpdatingItem = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log('=== SaleItem update error ===', err);
          this.swalService.error('Hata!', 'Ürün güncellenirken bir hata oluştu.');
          this.isUpdatingItem = false;
          this.cdr.detectChanges();
        }
      });
  }

  deleteSaleItem(): void {
    if (!this.editItem.id) return;
    
    this.swalService.deleteConfirm('Bu ürünü silmek istediğinizden emin misiniz?').then((result: any) => {
      if (result.isConfirmed) {
        this.isUpdatingItem = true;
        
        console.log('=== Deleting sale item ===', this.editItem.id);
        
        this.salesService.deleteSaleItem(this.editItem.id)
          .pipe(
            timeout(10000),
            catchError((err: any) => {
              console.log('=== SaleItem delete error ===', err);
              this.swalService.error('Hata!', 'Ürün silinirken bir hata oluştu.');
              this.isUpdatingItem = false;
              return of(null);
            })
          )
          .subscribe({
            next: (response: any) => {
              console.log('=== SaleItem delete response ===', response);
              
              if (response?.isSuccess) {
                // Başarılı olursa satışı yeniden yükle
                this.loadSale();
                this.closeItemDetailModal();
                this.swalService.success('Başarılı!', 'Ürün silindi.');
              } else {
                this.swalService.error('Hata!', response?.message || 'Ürün silinemedi.');
              }
              
              this.isUpdatingItem = false;
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              console.log('=== SaleItem delete error ===', err);
              this.swalService.error('Hata!', 'Ürün silinirken bir hata oluştu.');
              this.isUpdatingItem = false;
              this.cdr.detectChanges();
            }
          });
      }
    });
  }

  returnItem(item: any): void {
    if (!item || !this.sale) return;

    this.selectedReturnItem = item;
    this.returnNote = '';
    this.returnQuantity = 1;
    this.showReturnModal = true;
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.selectedReturnItem = null;
    this.returnNote = '';
    this.returnQuantity = 1;
  }

  confirmReturn(): void {
    if (!this.selectedReturnItem || !this.returnNote.trim() || !this.returnQuantity || this.returnQuantity <= 0) return;

    this.swalService.confirm(
      'Ürün İade İşlemi',
      `<strong>${this.selectedReturnItem.productName}</strong> ürününden <strong>${this.returnQuantity}</strong> adet iade etmek istediğinizden emin misiniz?<br><br>
       <strong>İade Notu:</strong> ${this.returnNote}<br><br>
       Bu işlem geri alınamaz!`
    ).then((result) => {
      if (result.isConfirmed) {
        this.loadSale();
        this.performReturn();
      }
    });
  }

  performReturn(): void {
    if (!this.sale || !this.selectedReturnItem) return;

    this.isReturning = true;
    this.returningItemId = this.selectedReturnItem.id;

    console.log('=== Returning item ===', {
      saleId: this.sale.id,
      productId: this.selectedReturnItem.productId,
      itemName: this.selectedReturnItem.productName,
      returnQuantity: this.returnQuantity,
      returnNote: this.returnNote
    });

    this.salesService.updateSaleItemToReturn(this.sale.id, this.selectedReturnItem.productId, this.returnNote, this.returnQuantity)
      .pipe(
        finalize(() => {
          this.isReturning = false;
          this.returningItemId = '';
          this.closeReturnModal();
          this.cdr.detectChanges();
        }),
        catchError((err: any) => {
          console.error('=== Return item error ===', err);
          this.swalService.error('Hata!', 'Ürün iade edilirken bir hata oluştu.');
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Return item response ===', response);
          
          if (response?.isSuccess) {
            this.swalService.success('Başarılı!', 'Ürün başarıyla iade edildi.');
            
            // İade miktarını güncelle
            if (this.sale?.saleItems && this.selectedReturnItem) {
              const item = this.sale.saleItems.find((i: any) => i.id === this.selectedReturnItem.id);
              if (item) {
                item.returnedQuantity = (item.returnedQuantity || 0) + this.returnQuantity;
                item.isReturned = (item.quantity - item.returnedQuantity) <= 0;
                item.returnedNote = this.returnNote;
                item.returnedDate = new Date();
              }
            }
            
            this.cdr.detectChanges();
          } else {
            this.swalService.error('Hata!', response?.message || 'Ürün iade edilemedi.');
          }
        },
        error: (err: any) => {
          console.error('=== Return item API error ===', err);
          this.swalService.error('Hata!', err?.error?.message || 'Ürün iade edilirken bir hata oluştu.');
        }
      });
  }
}
