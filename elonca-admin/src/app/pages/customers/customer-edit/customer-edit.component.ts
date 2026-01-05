import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { CustomersService } from '../customers.service';
import { SwalService } from '../../../core/swal.service';
import { StoresService } from '../../stores/stores.service';
import { BaseComponent } from '../../../core/base.component';
import { Injectable } from '@angular/core';
import { ProductsService } from '../../products/products.service';
import { SalesService } from '../../sales/sales.service';

// Mock Products Service - moved outside component
@Injectable({
  providedIn: 'root'
})
 

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent extends BaseComponent implements OnInit, AfterViewInit {
  customer: any = null;
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  createModel: any = {};

  // Sales and debts data
  sales: any[] = [];
  debts: any[] = [];
  isLoadingSales = false;
  isLoadingDebts = false;

  // Sales modal
  showSalesModal = false;
  isSavingSale = false;
  products: any[] = [];
  
  // Product selection modal
  showProductModal = false;
  saleProducts: any[] = [];
  selectedProduct: string = '';
  productQuantity = 1;
  productDiscount = 0;
  
  // Return modal properties
  showReturnModal = false;
  showReturnProductModal = false;
  isSavingReturn = false;
  returnProducts: any[] = [];
  currentSaleId: string = '';
  selectedReturnProduct: string = '';
  returnProductQuantity = 1;
  
  availableProducts: any[] = [];
  isLoadingProducts = false;
  newSale: any = {
    description: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 0
  };

  // Financial summary
  totalReceivable = 0;
  totalPayable = 0;
  financialStatus: 'positive' | 'negative' | 'neutral' = 'neutral';

  // API URL
  private apiUrl = 'https://localhost:7127/api';
   

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private customersService: CustomersService,
    private swalService: SwalService,
    private storeService: StoresService,
    private productsService: ProductsService,
    private salesService: SalesService,
    private http: HttpClient
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadCustomer();
    this.loadAvailableProducts();
    // Change detection için
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Ensure change detection runs after view is initialized
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  loadCustomer(): void {
    if (this.isLoading) return;
    
    if (!this.isBrowser()) {
      console.log('=== Running on server - skipping customer load ===');
      return;
    }
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.swalService.error('Hata', 'Müşteri ID bulunamadı.');
      this.isLoading = false;
      return;
    }
    
    this.customersService
      .getById(id,this.currentStoreId)
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
            this.customer = data;
            this.loadCustomerFinancialData();
          }
          this.isLoading = false;
          // Force change detection
          this.cdr.detectChanges();
          // Additional force after a small delay
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 50);
        }
      });
  }
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
              description:product.description,
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
  formatCurrency(amount: number): string {
    if (amount == null) return '-';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    
    // Handle Turkish date format "DD.MM.YYYY"
    if (dateString.includes('.')) {
      return dateString;
    }
    
    // Handle ISO format
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  loadCustomerFinancialData(): void {
    if (!this.customer) return;
    
    // Load sales data
    this.isLoadingSales = true;
    this.loadSales();

    // Load debts data
    this.isLoadingDebts = true;
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      this.debts = [
        { id: 1, date: '2024-01-10', amount: 500, description: 'Kısa Vadeli Borç', status: 'active' },
        { id: 2, date: '2024-01-25', amount: 1200, description: 'Uzun Vadeli Borç', status: 'active' }
      ];
      this.isLoadingDebts = false;
      this.calculateFinancialSummary();
      this.cdr.detectChanges();
    }, 1500);
  }

  loadSales(): void {
    console.log('=== loadSales method called ===');
    if (!this.customer) return;
    
    const payload = {
      storeId: this.currentStoreId || this.customer.storeId,
      storeCustomerId: this.customer.customerId
    };

    console.log('=== Loading sales from API ===', payload);

    this.salesService.getAllCustomerSale(payload)
      .pipe(
        timeout(10000),
        catchError((err: any) => {
          console.log('=== Sales load error ===', err);
          this.swalService.error('Hata', 'Satışlar yüklenirken bir hata oluştu.');
          this.cdr.detectChanges();
          return of([]);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Sales API Response ===', response);
          
          if (Array.isArray(response)) {
            this.sales = response.map((sale: any) => ({
              id: sale.id || sale.saleId || Date.now().toString(),
              amount: sale.totalAmount || 0,
              date: sale.createdAt || new Date().toISOString(),
              products: sale.notes || `${sale.saleItems?.length || 0} ürün satışı`,
              status: sale.paymentStatus === 1 ? 'paid' : 'pending',
              invoiceNumber: sale.invoiceNumber || '',
              customerName: sale.customerCode || this.customer.storeName,
              items: sale.saleItems || [],
              paidAmount: sale.paidAmount || 0,
              remainingAmount: sale.remainingAmount || 0,
              saleUser:sale.saleUser || '',
              paymentType: sale.paymentType || 1,
              storeName: sale.storeName || '',
              isSale: sale.isSale,
              transactionType: sale.transactionType,
              sellerStoreId: sale.sellerStoreId,
              sellerStoreName: sale.sellerStoreName,
              buyerStoreId: sale.buyerStoreId,
              buyerStoreName: sale.buyerStoreName,
              partnerStoreName: sale.partnerStoreName
            }));
          } else if (response?.isSuccess && response?.data) {
            this.sales = response.data.map((sale: any) => ({
              id: sale.id || sale.saleId || Date.now().toString(),
              amount: sale.totalAmount || 0,
              date: sale.saleDate || new Date().toISOString(),
              products: sale.notes || `${sale.saleItems?.length || 0} ürün satışı`,
              status: sale.paymentStatus === 1 ? 'paid' : 'pending',
              invoiceNumber: sale.invoiceNumber || '',
              customerName: sale.customerCode || this.customer.storeName,
              items: sale.saleItems || [],
              paidAmount: sale.paidAmount || 0,
              remainingAmount: sale.remainingAmount || 0,
              paymentType: sale.paymentType || 1,
              storeName: sale.storeName || '',
              isSale: sale.isSale,
              transactionType: sale.transactionType,
              sellerStoreId: sale.sellerStoreId,
              sellerStoreName: sale.sellerStoreName,
              buyerStoreId: sale.buyerStoreId,
              buyerStoreName: sale.buyerStoreName,
              partnerStoreName: sale.partnerStoreName
            }));
          }
          
          this.isLoadingSales = false;
          this.calculateFinancialSummary();
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err: any) => {
          console.log('=== Sales API error ===', err);
          this.cdr.detectChanges();
        }
      });
  }

  calculateFinancialSummary(): void {
    // Calculate total receivable (alacak)
    this.totalReceivable = this.sales
      .filter(sale => sale.status === 'pending')
      .reduce((total, sale) => total + sale.amount, 0);

    // Calculate total payable (borç)
    this.totalPayable = this.debts
      .filter(debt => debt.status === 'active')
      .reduce((total, debt) => total + debt.amount, 0);

    // Determine financial status
    if (this.totalReceivable > 0 && this.totalPayable === 0) {
      this.financialStatus = 'positive'; // Only receivables
    } else if (this.totalPayable > 0 && this.totalReceivable === 0) {
      this.financialStatus = 'negative'; // Only payables
    } else if (this.totalReceivable > this.totalPayable) {
      this.financialStatus = 'positive'; // More receivables than payables
    } else if (this.totalPayable > this.totalReceivable) {
      this.financialStatus = 'negative'; // More payables than receivables
    } else {
      this.financialStatus = 'neutral'; // Equal or both zero
    }
  }

  onSave(): void {
    if (this.isSaving || !this.customer) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.customer.id,
      customerCode: this.customer.customerCode,
      storeName: this.customer.storeName,
      customerType: this.customer.customerType,
      discountRate: this.customer.discountRate,
      phone: this.customer.phone,
      email: this.customer.email,
      address: this.customer.address,
      isActive: this.customer.isActive
    };

    this.customersService
      .update(this.customer.id, updateData)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.swalService.success('Başarılı!', 'Müşteri bilgileri başarıyla güncellendi.');
        },
        error: (err: any) => {
          this.swalService.error('Hata!', err?.error?.message || 'Müşteri güncellenemedi.');
        }
      });
  }

  deleteCustomer(): void {
    if (!this.customer) return;
    
    const customerName = this.customer.storeName || 'Bu müşteri';
    
    this.swalService.deleteConfirm(customerName).then((result: any) => {
      if (result.isConfirmed) {
        this.isDeleting = true;
        
        this.customersService.delete(this.customer.id).subscribe({
          next: () => {
            this.swalService.success('Müşteri silindi', `${customerName} başarıyla silindi.`);
            this.router.navigate(['/admin/customers']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Müşteri silinirken bir hata oluştu.');
            this.isDeleting = false;
          }
        });
      }
    });
  }

  getCustomerType(type: any): string {
    if (type == 1) return "Bireysel";
    else if (type == 2) return "Kurumsal";
    else return type || 'Bireysel';
  }

  onClose(): void {
    this.router.navigate(['/admin/customers']);
  }

  goToSaleDetail(sale: any): void {
    if (sale && sale.id) {
      this.router.navigate(['/admin/sales/edit', sale.id]);
    }
  }

  onDelete(): void {
    if (!this.customer) return;
    
    const customerName = `${this.customer.firstName || ''} ${this.customer.lastName || ''}`.trim() || 'Bu müşteri';
    
    this.swalService.deleteConfirm(customerName).then((result: any) => {
      if (result.isConfirmed) {
        this.customersService.delete(this.customer.id).subscribe({
          next: () => {
            this.swalService.success('Müşteri silindi', `${customerName} başarıyla silindi.`);
            this.router.navigate(['/admin/customers']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Müşteri silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  openSalesModal(): void {
    this.showSalesModal = true;
    this.saleProducts = [];
    this.resetNewSale();
  }

  closeSalesModal(): void {
    this.showSalesModal = false;
    this.resetNewSale();
  }

  openProductModal(): void {
    this.showProductModal = true;
    this.resetProductSelection();
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.resetProductSelection();
  }

  resetNewSale(): void {
    this.newSale = {
      description: '',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      totalAmount: 0
    };
    this.saleProducts = [];
  }

  resetProductSelection(): void {
    this.selectedProduct = '';
    this.productQuantity = 1;
    this.productDiscount = 0;
  }

  onProductSelect(): void {
    if (this.selectedProduct) {
      const product = this.availableProducts.find(p => p.id === this.selectedProduct);
      if (product) {
        this.productDiscount = product.discount || 0;
        this.calculateProductPrice();
      }
    }
  }

  calculateProductPrice(): { subtotal: number; discountAmount: number; totalPrice: number } {
    if (!this.selectedProduct) {
      return { subtotal: 0, discountAmount: 0, totalPrice: 0 };
    }
    
    const product = this.availableProducts.find(p => p.id === this.selectedProduct);
    if (!product) {
      return { subtotal: 0, discountAmount: 0, totalPrice: 0 };
    }
    
    const unitPrice = product.price || 0;
    const quantity = this.productQuantity || 1;
    const discount = this.productDiscount || 0;
    
    const subtotal = unitPrice * quantity;
    const discountAmount = subtotal * (discount / 100);
    const totalPrice = subtotal - discountAmount;
    
    return { subtotal, discountAmount, totalPrice };
  }

  addProductToSale(): void {
    if (!this.selectedProduct) {
      this.swalService.error('Hata', 'Lütfen bir ürün seçin.');
      return;
    }

    if (!this.productQuantity || this.productQuantity <= 0) {
      this.swalService.error('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    const product = this.availableProducts.find(p => p.id === this.selectedProduct);
    const calculation = this.calculateProductPrice();
    
    const saleProduct = {
      id: Date.now().toString(),
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      quantity: this.productQuantity,
      unitPrice: product.price,
      discount: this.productDiscount,
      subtotal: calculation.subtotal,
      discountAmount: calculation.discountAmount,
      totalPrice: calculation.totalPrice
    };

    this.saleProducts.push(saleProduct);
    this.calculateSaleTotal();
    
    this.closeProductModal();
    this.swalService.success('Başarılı', `${product.name} ürünü satışa eklendi.`);
  }

  calculateSaleTotal(): void {
    this.newSale.totalAmount = this.saleProducts.reduce((total, product) => total + product.totalPrice, 0);
  }

  removeProductFromSale(productId: string): void {
    this.saleProducts = this.saleProducts.filter(p => p.id !== productId);
    this.calculateSaleTotal();
  }

  updateSaveNewSale(): void {
    if (this.isSavingSale) return;
    
    if (this.saleProducts.length === 0) {
      this.swalService.error('Hata', 'Lütfen en az bir ürün ekleyin.');
      return;
    }

    this.isSavingSale = true;

    // Convert saleProducts to saleItems format
    const saleItems = this.saleProducts.map(product => ({
      id: crypto.randomUUID(),
      saleId: null,
      productId: product.productId,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      totalAmount: null,
      discount: product.discount || null,
      customerDiscount: 0,
      totalPrice: product.totalPrice,
      productName: product.productName,
      productCode: product.productCode, 
    }));

    const saleData = {
      storeId: this.currentStoreId || null, // Mevcut user'ın store'u
      storeCustomerId: this.customer.storeId, // Ürün eklediğim customer
      tenantId: null,
      saleDate: new Date().toISOString(), // UTC formatında
      invoiceNumber: Date.now().toString(),
      totalAmount: this.newSale.totalAmount,
      paidAmount: 0,
      remainingAmount: this.newSale.totalAmount,
      paymentType: 1, // Default payment type
      paymentStatus: 1, // Default payment status
      notes: this.newSale.description || 'Satış',
      saleItems: saleItems
    };

    console.log('=== Saving sale with SalesService ===', saleData);

    this.salesService.create(saleData).subscribe({
      next: (response: any) => {
        console.log('=== Sale API response ===', response);
        
        const savedSale = {
          id: response.id || Date.now().toString(),
          amount: saleData.totalAmount,
          date: saleData.saleDate,
          description: `${this.saleProducts.length} ürün satışı`,
          status: 'pending'
        };
         
        this.calculateFinancialSummary();
        
        this.isSavingSale = false;
        this.closeSalesModal();
        this.cdr.detectChanges();
        if(response.isSuccess){

          this.swalService.success(
            response.message
          );
        }else 
        {
          this.swalService.error(response.message)
        }
         
        this.loadCustomer();
      },
      error: (err: any) => {
        console.error('=== Sale API error ===', err);
        this.isSavingSale = false;
        this.cdr.detectChanges();
        
        this.swalService.error(
          'Hata!', 
          err?.error?.message || 'Satış kaydedilirken bir hata oluştu.'
        );
      }
    });
  }

  onProductChange(): void {
    if (this.newSale.product) {
      const selectedProduct = this.availableProducts.find(p => p.name === this.newSale.product);
      if (selectedProduct) {
        this.newSale.productId = selectedProduct.id;
        this.newSale.productCode = selectedProduct.code;
        this.newSale.unitPrice = selectedProduct.price;
        this.newSale.quantity = this.newSale.quantity || 1;
        this.newSale.discount = selectedProduct.discount || 0;
        this.newSale.description = selectedProduct.description || selectedProduct.name;
        this.calculateProductTotal();
      }
    } else {
      this.resetSaleFields();
    }
  }

  resetSaleFields(): void {
    this.newSale.productId = '';
    this.newSale.productCode = '';
    this.newSale.unitPrice = 0;
    this.newSale.quantity = 1;
    this.newSale.discount = 0;
    this.newSale.totalPrice = 0;
    this.newSale.description = '';
  }

  getSelectedProductPrice(): number {
    if (!this.selectedProduct) return 0;
    const product = this.availableProducts.find(p => p.id === this.selectedProduct);
    return product?.price || 0;
  }

  getSelectedProductCode(): string {
    if (!this.selectedProduct) return '-';
    const product = this.availableProducts.find(p => p.id === this.selectedProduct);
    return product?.code || '-';
  }

  calculateProductTotal(): void {
    const quantity = this.newSale.quantity || 1;
    const unitPrice = this.getSelectedProductPrice();
    const discount = this.newSale.discount || 0;
    
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    this.newSale.totalPrice = subtotal - discountAmount;
  }

  saveNewSale(): void {
    if (this.isSavingSale) return;
    
    if (!this.newSale.product || !this.newSale.totalPrice || this.newSale.totalPrice <= 0) {
      this.swalService.error('Hata', 'Lütfen ürün seçin ve geçerli bir tutar girin.');
      return;
    }

    if (!this.newSale.quantity || this.newSale.quantity <= 0) {
      this.swalService.error('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    this.isSavingSale = true;

    // Find selected product for additional details
    const selectedProduct = this.availableProducts.find(p => p.name === this.newSale.product);
    
    // Create new sale object with real data
    const saleData = {
      id: Date.now().toString(), // Temporary ID - will be replaced by backend
      customerId: this.customer.id,
      productId: this.newSale.productId,
      productCode: this.newSale.productCode,
      productName: this.newSale.product,
      quantity: this.newSale.quantity || 1,
      unitPrice: this.newSale.unitPrice,
      discount: this.newSale.discount || 0,
      totalPrice: this.newSale.totalPrice,
      description: this.newSale.description || `${this.newSale.quantity} x ${this.newSale.product}`,
      status: this.newSale.status,
      date: this.newSale.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      productDetails: selectedProduct ? {
        id: selectedProduct.id,
        name: selectedProduct.name,
        code: selectedProduct.code,
        description: selectedProduct.description
      } : null
    };

    console.log('=== Saving new sale ===', saleData);

    this.http.post(`${this.apiUrl}/sales`, saleData).subscribe({
      next: (response: any) => {
        console.log('=== Sale API response ===', response);
        
        const savedSale = {
          ...saleData,
          id: response.id || saleData.id, // Use backend ID if available
          amount: saleData.totalPrice, // For compatibility with existing table
          date: saleData.date
        };
        
        this.sales.unshift(savedSale);

        this.calculateFinancialSummary();
        
        this.isSavingSale = false;
        this.closeSalesModal();
        this.cdr.detectChanges();
        
        this.swalService.success(
          'Başarılı!', 
          `"${saleData.productName}" ürününden ${saleData.quantity} adet satış başarıyla eklendi.`
        );
        
        console.log('=== Sale saved successfully ===', savedSale);
      },
      error: (err: any) => {
        console.error('=== Sale API error ===', err);
        this.isSavingSale = false;
        this.cdr.detectChanges();
        
        this.swalService.error(
          'Hata!', 
          err?.error?.message || 'Satış kaydedilirken bir hata oluştu.'
        );
      }
    });
  }

  testButtonClick(): void {
    console.log('Button clicked!');
  }

  showAlert(): void {
    alert('Buton çalışıyor!');
  }

  openReturnModal(sale?: any): void {
    console.log('=== openReturnModal called with sale ===', sale);
    
    // Mevcut satış ID'sini sakla
    this.currentSaleId = sale?.id || '';
    
    this.showReturnModal = true;
    this.returnProducts = [];
    this.resetReturnData();
    
    // Müşteri detay sayfasından gelen veri için saleItems kontrolü
    if (sale && sale.items && sale.items.length > 0) {
      console.log('=== Sale items found ===', sale.items);
      
      // Satıştaki ürünleri iade ürünleri listesine ekle
      sale.items.forEach((item: any) => {
        console.log('=== Processing item ===', item);
        
        const returnProduct = {
          id:   item.id,
          productId: item.productId, // items içindeki productId kullan
          productCode: item.productCode || 'N/A',
          productName: item.productName || sale.notes || 'Ürün',
          quantity: 0,
          unitPrice: item.unitPrice || 0,
          subtotal: 0,
          totalPrice: 0,
          maxQuantity: item.quantity,
          originalQuantity: item.quantity
        };
        
        console.log('=== Created return product ===', returnProduct);
        this.returnProducts.push(returnProduct);
      });
      
      console.log('=== Final return products ===', this.returnProducts);
    }  
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.resetReturnData();
  }

  openReturnProductModal(): void {
    this.showReturnProductModal = true;
    this.resetReturnProductSelection();
  }

  closeReturnProductModal(): void {
    this.showReturnProductModal = false;
    this.resetReturnProductSelection();
  }

  resetReturnData(): void {
    this.returnProducts = [];
  }

  resetReturnProductSelection(): void {
    this.selectedReturnProduct = '';
    this.returnProductQuantity = 1;
  }

  onReturnProductSelect(): void {
    // Ürün seçildiğinde quantity'yi 1'e resetle
    this.returnProductQuantity = 1;
  }

  getSelectedReturnProductCode(): string {
    const product = this.availableProducts.find(p => p.id === this.selectedReturnProduct);
    return product ? product.code : '';
  }

  getSelectedReturnProductPrice(): number {
    const product = this.availableProducts.find(p => p.id === this.selectedReturnProduct);
    return product ? product.price : 0;
  }

  addProductToReturn(): void {
    if (!this.selectedReturnProduct) {
      this.swalService.error('Hata', 'Lütfen bir ürün seçin.');
      return;
    }

    if (this.returnProductQuantity <= 0) {
      this.swalService.error('Hata', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    const product = this.availableProducts.find(p => p.id === this.selectedReturnProduct);
    
    if (!product) {
      this.swalService.error('Hata', 'Seçilen ürün bulunamadı.');
      return;
    }
    
    const unitPrice = product.price;
    const subtotal = unitPrice * this.returnProductQuantity;
    
    const returnProduct = {
      id: Date.now().toString(),
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      quantity: this.returnProductQuantity,
      unitPrice: unitPrice,
      subtotal: subtotal,
      totalPrice: subtotal // İade için indirim yok
    };

    this.returnProducts.push(returnProduct);
    
    this.closeReturnProductModal();
    this.swalService.success('Başarılı', `${product.name} ürünü iadeye eklendi.`);
  }

  removeProductFromReturn(productId: string): void {
    this.returnProducts = this.returnProducts.filter(p => p.id !== productId);
  }

  validateReturnQuantity(product: any): void {
    const maxQuantity = product.maxQuantity || product.originalQuantity;
    let enteredQuantity = product.quantity;
    
    // Başta 0 varsa kaldır (örn: 05 -> 5)
    if (typeof enteredQuantity === 'string' && enteredQuantity.startsWith('0') && enteredQuantity.length > 1) {
      enteredQuantity = parseInt(enteredQuantity, 10);
      product.quantity = enteredQuantity;
    }
    
    // Max değeri aşarsa uyarı ver ve 0'a ayarla
    if (enteredQuantity > maxQuantity) {
      this.swalService.warning(
        'Miktar Limiti Aşıldı!',
        `"${product.productName}" ürününden en fazla ${maxQuantity} adet iade edebilirsiniz. Miktar 0 olarak ayarlandı.`
      );
      
      // 0'a ayarla
      product.quantity = 0;
      this.updateReturnProduct(product);
      return;
    }
    
    // Negatif değer kontrolü
    if (enteredQuantity < 0) {
      this.swalService.warning(
        'Geçersiz Miktar!',
        'İade miktarı negatif olamaz. Miktar 0 olarak ayarlandı.'
      );
      
      product.quantity = 0;
      this.updateReturnProduct(product);
      return;
    }
    
    // Geçerli değer ise fiyatları güncelle
    this.updateReturnProduct(product);
  }

  updateReturnProduct(product: any): void {
    // Sadece fiyatları güncelle (kontroller validateReturnQuantity'de yapılıyor)
    const quantity = product.quantity || 0;
    product.subtotal = product.unitPrice * quantity;
    product.totalPrice = product.subtotal; // İade için indirim yok
    
    console.log(`=== Updated product quantity ===`, {
      productName: product.productName,
      quantity: quantity,
      maxQuantity: product.maxQuantity || product.originalQuantity,
      subtotal: product.subtotal
    });
  }

  calculateReturnTotal(): number {
    return this.returnProducts.reduce((total, product) => total + product.totalPrice, 0);
  }

  canSaveReturn(): boolean {
    const validProducts = this.returnProducts.filter(p => p.quantity > 0);
    return validProducts.length > 0 && validProducts.every(p => p.returnNote && p.returnNote.trim().length > 0);
  }

  saveReturn(): void {
    if (this.isSavingReturn) return;
    
    if (this.returnProducts.length === 0) {
      this.swalService.error('Hata', 'Lütfen en az bir ürün ekleyin.');
      return;
    }

    // Sadece miktarı 0'dan büyük olan ürünleri filtrele
    const validReturnProducts = this.returnProducts.filter(p => p.quantity > 0);
    
    if (validReturnProducts.length === 0) {
      this.swalService.error('Hata', 'Lütfen en az bir ürün için iade miktarı girin.');
      return;
    }

    this.isSavingReturn = true;

    // Backend API için veri formatı
    const returnData = {
      saleId: this.currentSaleId, // Mevcut satış ID'si
      returnItems: validReturnProducts.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        returnNote: item.returnNote || '' // Her ürünün iade notu
      }))
    };

    console.log('=== Saving return to API ===', returnData);

    // API isteği gönder
    this.customersService.addReturnItemToSale(returnData).subscribe({
      next: (response: any) => { 
        console.log('=== Return API response ===', response);
        
        if (response && response.success) {
          // Başarılı ise satışlar listesini güncelle
          const returnSale = {
            id: response.data?.id || Date.now().toString(),
            amount: -this.calculateReturnTotal(), // Negatif tutar
            date: new Date().toISOString().split('T')[0],
            description: `${validReturnProducts.length} ürün iadesi`,
            status: 'pending',
            invoiceNumber: 'IADE-' + Date.now(),
            customerName: this.customer.name || this.customer.storeName,
            items: validReturnProducts,
            paidAmount: 0,
            remainingAmount: -this.calculateReturnTotal(),
            paymentType: 5, // İade tipi
            storeName: this.customer.storeName || '',
            isReturn: true // İade olduğunu belirtmek için
          };
          
          this.sales.unshift(returnSale);
          this.calculateFinancialSummary();
          
          this.isSavingReturn = false;
          this.closeReturnModal();
          this.cdr.detectChanges();
          
          this.swalService.success(
            'Başarılı!', 
            `Toplam ${this.formatCurrency(this.calculateReturnTotal())} tutarında iade başarıyla kaydedildi.`
          );
          console.log('=== About to load sales after return ===');
          this.loadSales();
        } else {
          this.isSavingReturn = false;
          this.swalService.error('Hata', response?.message || 'İade kaydedilirken bir hata oluştu.');
        }
      },
      error: (err: any) => {
        console.error('=== Return API error ===', err);
        this.isSavingReturn = false;
        this.cdr.detectChanges();
        
        this.swalService.error(
          'Hata!', 
          err?.error?.message || 'İade kaydedilirken bir hata oluştu.'
        );
      }
    });
  }

  // Satış/Alış kontrol metodları
  isSellerStore(sale: any): boolean {
    const result = sale.isSale === true;
    return result;
  }

  getPartnerStoreName(sale: any): string {
    if (this.isSellerStore(sale)) { 
      return sale.buyerStoreName || sale.customerCode || 'Bilinmeyen Mağaza';
    } else { 
      return sale.sellerStoreName || sale.partnerStoreName || 'Bilinmeyen Mağaza';
    }
  }
  
  getSellerStoreName(sale: any): string {
    return sale.sellerStoreName 
  }
}