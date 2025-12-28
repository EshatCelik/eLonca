import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { SwalService } from '../../../core/swal.service';
import { StoresService } from '../../stores/stores.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  isLoading = false;
  showCreateModal = false;
  isCreating = false;
  stores: any[] = [];
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

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService,
    private swalService:SwalService,
    private readonly storesService: StoresService
  ) {}

  ngOnInit(): void {
    console.log('=== UserListComponent LOADING ===');
    this.loadUsers();
    this.loadStores();
  }
  loadStores(): void {
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        this.stores = Array.isArray(data) ? data : (data?.data || []);
        console.log('=== Stores loaded ===', this.stores);
      },
      error: (err) => {
        console.error('Stores could not be loaded:', err);
      }
    });
  }
  loadUsers(): void {
    console.log('=== Loading users ===');
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Real API call
    this.usersService.getAll().subscribe({
      next: (data: any) => {
        this.users = Array.isArray(data) ? data : (data?.data || []);
        this.isLoading = false;
        console.log('=== Real users loaded ===', this.users);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('=== Users load error ===', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAddUser(): void {
    console.log('=== Add user clicked ===');
    this.showCreateModal = true;
    this.createModel = {
      name: '',
      lastName: '',
      userName: '',
      password: '',
      email: '',
      phoneNumber: '',
      userRole: '',
      storeId: ''
    };
  }

  onCreateUser(): void {
    console.log('=== Creating user ===', this.createModel);
    this.isCreating = true;
    
    this.usersService.create(this.createModel).subscribe({
      next: (result) => {
        this.showCreateModal = false;
        this.isCreating = false;
        this.loadUsers();
        this.swalService.success(result.message)
      },
      error: (err) => {
        console.error('Create error:', err);
        this.isCreating = false;
      }
    });
  }

  onCloseModal(): void {
    this.showCreateModal = false;
    this.isCreating = false;
  }

  onDeleteUser(user: any, event: Event): void {
    event.stopPropagation();
    console.log('=== Delete user clicked ===', user);
    
    const userName = user.name || user.userName || 'Bu kullanıcı';
    
    this.swalService.deleteConfirm(userName).then((result) => {
      if (result.isConfirmed) {
        this.usersService.delete(user.id).subscribe({
          next: () => {
            this.swalService.success('Kullanıcı silindi', `${userName} başarıyla silindi.`);
            this.loadUsers();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.swalService.error('Hata', 'Kullanıcı silinirken bir hata oluştu.');
          }
        });
      }
    });
  }

  onUserClick(user: any): void {
    console.log('=== User clicked ===', user);
    // Kullanıcı detay/edit sayfasına yönlendirme
    this.router.navigate(['/admin/users', user.id]);
  }

  onEditUser(event: Event, user: any): void {
    event.stopPropagation();
    // Düzenleme işlemleri burada yapılacak
    console.log('Kullanıcı düzenleniyor:', user);
    // Örnek: this.router.navigate(['/users/edit', user.id]);
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  trackByStoreId(index: number, store: any): number {
    return store.id;
  }

  getActiveUsersCount(): number {
    return this.users?.filter(u => u.isActive).length || 0;
  }

  getRoleText(role: number): string {
    switch (role) {
      case 0: return 'Admin';
      case 1: return 'Kullanıcı';
      case 2: return 'Yönetici';
      default: return 'Bilinmeyen';
    }
  }

  getRoleIcon(role: number): string {
    switch (role) {
      case 0: return 'fa-crown';
      case 1: return 'fa-user';
      case 2: return 'fa-user-tie';
      default: return 'fa-question';
    }
  }

  getRoleClass(role: number): string {
    switch (role) {
      case 0: return 'admin-role';
      case 1: return 'user-role';
      case 2: return 'manager-role';
      default: return 'unknown-role';
    }
  }
}
