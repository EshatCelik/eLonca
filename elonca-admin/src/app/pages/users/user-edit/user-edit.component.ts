import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';
import { StoresService } from '../../stores/stores.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  user: any = null;
  isLoading = false;
  errorMessage = '';
  stores: any[] = [];
  isSaving = false;

  constructor(
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadStores();
  }

  loadStores(): void {
    this.storesService.getAll().subscribe({
      next: (data: any) => {
        this.stores = Array.isArray(data) ? data : (data?.data || []);
      },
      error: (err) => {
        console.error('Stores could not be loaded:', err);
      }
    });
  }

  loadUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Kullanıcı ID bulunamadı.';
      return;
    }

    this.isLoading = true;
    this.usersService.getById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Kullanıcı yüklenirken hata oluştu:', err);
        this.errorMessage = 'Kullanıcı bilgileri yüklenirken bir hata oluştu.';
        this.isLoading = false;
        
        // Eğer yetkilendirme hatası alırsak login sayfasına yönlendir
        if (err.status === 401) {
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  onUpdate(): void {
    if (!this.user) return;

    this.isSaving = true;

    const updateData = {
      id: this.user.id,
      name: this.user.name,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      userName: this.user.userName,
      userRole: this.user.userRole,
      isActive: this.user.isActive,
      storeId: this.user.storeId
    };

    // Mock update
    setTimeout(() => {
      alert('Kullanıcı başarıyla güncellendi (mock)!');
      this.isSaving = false;
      this.router.navigate(['/admin/users']);
    }, 1000);
  }

  onClose(): void {
    this.router.navigate(['/admin/users']);
  }
}