import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { CategoriesService } from './categories.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    name: '',
    description: ''
  };
  createMessage = '';
  createSuccess = false;
  private routerSubscription?: Subscription;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(() => {
      setTimeout(() => {
        if (!this.isLoading) {
          this.load();
        }
      }, 50);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  load(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.categoriesService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.categories = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Kategori listesi alınamadı.';
        }
      });
  }

  statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }

  toggleCreate(): void {
    if (this.isCreating) return;
    this.showCreate = true;
    this.createMessage = '';
    this.createSuccess = false;
    this.createModel = { name: '', description: '' };
  }

  closeCreate(): void {
    if (this.isCreating) return;
    this.showCreate = false;
    this.createMessage = '';
    this.createSuccess = false;
  }

  onCreate(): void {
    if (this.isCreating) return;
    this.isCreating = true;
    this.categoriesService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Kategori başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { name: '', description: '' };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Kategori oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(c: any): void {
    const id = this.getId(c);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.categoriesService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Kategori silinemedi.';
        }
      });
  }

  getId(c: any): string | number | null {
    return c?.id ?? c?.categoryId ?? c?.categoryID ?? null;
  }
}
