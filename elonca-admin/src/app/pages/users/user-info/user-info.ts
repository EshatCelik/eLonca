import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';
import { StoresService } from '../../stores/stores.service';
import { SwalService } from '../../../core/swal.service';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss'
})
export class UserInfo implements OnInit {
  user: any = null;
  isLoading = false;
  errorMessage = '';
  stores: any[] = [];
  isSaving = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
    private readonly swalService: SwalService
  ) {}

  ngOnInit(): void {
    console.log('=== UserInfo OnInit ===');
    this.loadUser();
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

  loadUser(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('=== Loading user with ID ===', id);
    
    if (!id) {
      this.errorMessage = 'Kullanıcı ID bulunamadı.';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Real API call
    this.usersService.getById(id).subscribe({
      next: (data: any) => {
        this.user = data;
        this.isLoading = false;
        console.log('=== Real user data loaded ===', this.user);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Kullanıcı bilgileri alınamadı.';
        this.isLoading = false;
        console.error('=== User load error ===', err);
        this.cdr.detectChanges();
      }
    });
  }

  onUpdate(): void {
    if (!this.user || this.isSaving) return;

    this.isSaving = true;
    this.cdr.detectChanges();

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

    console.log('=== Updating user ===', updateData);

    this.usersService.update(this.user.id, updateData).subscribe({
      next: (result) => {
        console.log('=== User updated successfully ===');
       this.swalService.confirm(result.message);
        this.isSaving = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
       this.swalService.error(err.message);
        
        this.isSaving = false;
        console.error('=== User update error ===', err);
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
