import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UsersService } from './users.service';
import { StoresService } from '../stores/stores.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  stores: any[] = [];
  isLoading = false;
  errorMessage = '';
  showCreate = false;
  isCreating = false;
  deletingId: string | number | null = null;
  createModel: any = {
    name: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    role: '',
    storeId: ''
  };
  createMessage = '';
  createSuccess = false;

  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadStores();
  }

  load(): void {
    if (this.isLoading) return;
    this.errorMessage = '';
    this.isLoading = true;

    this.usersService
      .getAll()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data: any) => {
          const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
          this.users = Array.isArray(list) ? list : [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Kullanıcı listesi alınamadı.';
        }
      });
  }

  loadStores(): void {
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.items ?? data?.data ?? []);
        this.stores = Array.isArray(list) ? list : [];
      },
      error: (err) => {
        console.error('Store listesi alınamadı:', err);
      }
    });
  }

  statusLabel(v: any): string {
    if (v === 1 || v === true || v === 'Active') return 'Aktif';
    if (v === 0 || v === false || v === 'Passive') return 'Pasif';
    return v ?? '-';
  }

  roleLabel(v: any): string {
    switch (v) {
      case 'admin': return 'Admin';
      case 'user': return 'Kullanıcı';
      case 'manager': return 'Yönetici';
      default: return v ?? '-';
    }
  }

  toggleCreate(): void {
    if (this.isCreating) return;
    this.showCreate = true;
    this.createMessage = '';
    this.createSuccess = false;
    this.createModel = { 
      name: '', 
      lastName: '', 
      userName: '', 
      password: '', 
      email: '', 
      phoneNumber: '', 
      role: '', 
      storeId: '' 
    };
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
    this.usersService
      .create(this.createModel)
      .pipe(finalize(() => (this.isCreating = false)))
      .subscribe({
        next: () => {
          this.createMessage = 'Kullanıcı başarıyla oluşturuldu.';
          this.createSuccess = true;
          this.createModel = { 
            name: '', 
            lastName: '', 
            userName: '', 
            password: '', 
            email: '', 
            phoneNumber: '', 
            role: '', 
            storeId: '' 
          };
          this.load();
        },
        error: (err) => {
          this.createMessage = err?.error?.message || 'Kullanıcı oluşturulamadı.';
          this.createSuccess = false;
        }
      });
  }

  onDelete(u: any): void {
    const id = this.getId(u);
    if (id == null || this.deletingId != null) return;
    this.deletingId = id;
    this.usersService
      .delete(id)
      .pipe(finalize(() => (this.deletingId = null)))
      .subscribe({
        next: () => {
          this.load();
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Kullanıcı silinemedi.';
        }
      });
  }

  getId(u: any): string | number | null {
    return u?.id ?? u?.userId ?? u?.userID ?? null;
  }

  onRowClick(user: any, event?: MouseEvent): void {
    if (event && (event.target as HTMLElement).closest('button')) {
      return;
    }
    
    event?.preventDefault();
    event?.stopPropagation();
    
    const id = this.getId(user);
    if (id != null) {
      this.router.navigate([`/admin/users/${id}/edit`]);
    }
  }
}
