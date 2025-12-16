import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoriesService } from './categories.service';
import { Router } from '@angular/router';
import { StoresService } from '../stores/stores.service';
import { SwalService } from '../../core/swal.service';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  stores: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  createModel: any = {
    name: '',
    description: '',
    color: '#007bff',
    storeId: ''
  };

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private swalService: SwalService,
    private readonly storesService: StoresService
  ) {}

  ngOnInit(): void {
    console.log('=== CategoriesComponent LOADING ===');
    this.loadCategories();
    this.loadStores();
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
    console.log('=== Loading categories ===');
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.categoriesService.getAll().subscribe({
      next: (data: any) => {
        this.categories = Array.isArray(data) ? data : (data?.data || []);
        this.isLoading = false;
        console.log('=== Categories loaded ===', this.categories);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('=== Categories load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddCategory(): void {
    console.log('=== Add category clicked ===');
    this.showCreateModal = true;
    this.createModel = {
      name: '',
      description: '',
      color: '#007bff',
      storeId: ''
    };
  }

  createCategory(): void {
    console.log('=== Creating category ===', this.createModel);
    this.isCreating = true;
    
    this.categoriesService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadCategories();
        this.swalService.success(result.message || 'Kategori başarıyla oluşturuldu.');
      },
      error: (err) => {
        console.error('Create error:', err);
        this.isCreating = false;
        this.swalService.error('Hata', 'Kategori oluşturulurken bir hata oluştu.');
      }
    });
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
  }

  onDeleteCategory(category: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete category clicked ===', category);
    
    const categoryName = category.name || 'Bu kategori';
    const categoryId = this.getId(category);
    
    if (categoryId == null) {
      console.error('Category ID not found');
      return;
    }
    
    this.swalService.deleteConfirm(categoryName).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService.delete(categoryId).subscribe({
          next: () => {
            this.swalService.success('Kategori silindi', `${categoryName} başarıyla silindi.`);
            this.loadCategories();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.swalService.error('Hata', 'Kategori silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  onCategoryClick(category: any): void {
    console.log('=== Category clicked ===', category);
    const id = this.getId(category);
    if (id != null) {
      this.router.navigate(['/admin/categories', id, 'edit']);
    }
  }

  getId(c: any): string | number | null {
    return c?.id ?? c?.categoryId ?? c?.categoryID ?? null;
  }
}
