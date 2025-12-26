import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../core/base.component';
import { StockMovementService } from '../stock-movement.service';
import { ProductsService } from '../../products/products.service';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-stock-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  productId: string = '';
  storeId: string = '';
  stockMovements: any[] = [];
  product: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private stockMovementService: StockMovementService,
    private productsService: ProductsService
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['productId'] || '';
      this.storeId = params['storeId'] || '';
      
      if (this.productId && this.storeId) {
        this.loadProductDetails();
        this.loadStockMovements();
      } else {
        this.errorMessage = 'Geçersiz stok bilgileri';
      }
    });
  }

  loadProductDetails(): void {
    if (!this.productId) return;
    
    this.productsService.getById(this.productId).subscribe({
      next: (response: any) => {
        this.product = response?.data || response;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('=== Product load error ===', err);
        this.errorMessage = 'Ürün bilgileri yüklenemedi';
      }
    });
  }

  loadStockMovements(): void {
    if (!this.productId || !this.storeId) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      productId: this.productId,
      storeId: this.currentStoreId
    };

    console.log('=== Loading stock movements ===', payload);

    this.stockMovementService.getProductMovements(payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
        catchError((err: any) => {
          console.error('=== Stock movements load error ===', err);
          this.errorMessage = 'Stok hareketleri yüklenirken bir hata oluştu';
          return of([]);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('=== Stock movements response ===', response);
          
          if (response?.isSuccess && response?.data) {
            this.stockMovements = response.data;
          } else if (Array.isArray(response)) {
            this.stockMovements = response;
          } else {
            this.stockMovements = [];
          }
          
          console.log('=== Stock movements loaded ===', this.stockMovements);
        },
        error: (err: any) => {
          console.error('=== Stock movements API error ===', err);
          this.errorMessage = err?.error?.message || 'Stok hareketleri alınamadı';
        }
      });
  }

  getMovementTypeText(type: number): string {
    switch (type) {
      case 1: return 'Stok Girişi';
      case 2: return 'Stok Çıkışı';
      case 3: return 'Stok Düzenleme';
      case 4: return 'Stok İade';
      default: return 'Bilinmeyen';
    }
  }

  getMovementTypeIcon(type: number): string {
    switch (type) {
      case 1: return 'fa-plus-circle';
      case 2: return 'fa-minus-circle';
      case 3: return 'fa-edit';
      case 4: return 'fa-undo';
      default: return 'fa-question-circle';
    }
  }

  getMovementTypeClass(type: number): string {
    switch (type) {
      case 1: return 'movement-in';
      case 2: return 'movement-out';
      case 3: return 'movement-update';
      case 4: return 'movement-restore';
      default: return 'movement-unknown';
    }
  }

  getTotalStockIn(): number {
    return this.stockMovements
      .filter(m => m.movementType === 1)
      .reduce((acc, m) => acc + (m.quantity || 0), 0);
  }

  getTotalStockOut(): number {
    return this.stockMovements
      .filter(m => m.movementType === 2)
      .reduce((acc, m) => acc + (m.quantity || 0), 0);
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

  goBack(): void {
    this.router.navigate(['/admin/inventory']);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
