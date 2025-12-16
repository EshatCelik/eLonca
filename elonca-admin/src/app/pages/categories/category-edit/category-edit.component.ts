import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, catchError } from 'rxjs';
import { of } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { StoresService } from '../../stores/stores.service';
import { SwalService } from '../../../core/swal.service';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss'
})
export class CategoryEditComponent implements OnInit {
  category: any = null;
  stores: any[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly storesService: StoresService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.loadStores();
    this.loadCategory();
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

  loadCategory(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.swalService.error('Hata', 'Kategori ID bulunamadı.');
      this.isLoading = false;
      return;
    }

    this.categoriesService
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
            this.category = data;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onSave(): void {
    if (this.isSaving || !this.category) return;
    
    this.isSaving = true;

    const updateData = {
      id: this.category.id,
      name: this.category.name,
      description: this.category.description,
      color: this.category.colorCode,
      isActive:this.category.isActive,
      storeId: this.category.storeId
    };

    this.categoriesService
      .update(this.category.id, updateData)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          this.swalService.success('Başarılı!', 'Kategori bilgileri başarıyla güncellendi.');
        },
        error: (err: any) => {
          this.swalService.error('Hata!', err?.error?.message || 'Kategori güncellenemedi.');
        }
      });
  }

  onClose(): void {
    this.router.navigate(['/admin/categories']);
  }

  onDelete(): void {
    if (!this.category) return;
    
    const categoryName = this.category.name || 'Bu kategori';
    
    this.swalService.deleteConfirm(categoryName).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.delete(this.category.id).subscribe({
          next: () => {
            this.swalService.success('Kategori silindi', `${categoryName} başarıyla silindi.`);
            this.router.navigate(['/admin/categories']);
          },
          error: (err: any) => {
            this.swalService.error('Hata', 'Kategori silinirken bir hata oluştu.');
          }
        });
      }
    });
  }
}
