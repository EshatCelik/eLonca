import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { BaseComponent } from '../../core/base.component';
import { SwalService } from '../../core/swal.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends BaseComponent implements OnInit {
  isLoading = false;
  profileData: any = {
    fullName: '',
    email: '',
    role: '',
    tenantName: '',
    storeName: '',
    createdAt: ''
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object, private swalService: SwalService) {
    super(platformId);
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.isLoading = true;
    
    // BaseComponent'ten kullanıcı bilgilerini al
    this.profileData = {
      fullName: this.currentUserFullName || '-',
      email: this.currentUserEmail || '-',
      role: this.currentUserRole || '-',
      tenantName: this.currentTenant?.name || '-',
      storeId: this.currentStoreId || '-',
      createdAt: this.getFormattedDate()
    };
    
    this.isLoading = false;
  }

  getFormattedDate(): string {
    // localStorage'dan tarih bilgisini al veya varsayılan kullan
    const storedDate = localStorage.getItem('login_date');
    if (storedDate) {
      return new Date(storedDate).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onEditProfile(): void {
    this.swalService.info('Bilgi', 'Profil düzenleme özelliği yakında eklenecek.');
  }
}
