import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCompaniesService } from './product-companies.service';
import { ProductCompany, CreateProductCompanyCommand, UpdateProductCompanyCommand } from './product-company.model';
import { BaseComponent } from '../../core/base.component';

@Component({
  selector: 'app-product-companies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-companies.component.html',
  styleUrl: './product-companies.component.scss'
})
export class ProductCompaniesComponent extends BaseComponent  implements OnInit {
  productCompanies: ProductCompany[] = [];
  isLoading = false;
  
  // Form için
  selectedCompany: ProductCompany | null = null;
  isCreating = false;
  isEditing = false;
  
  // Form alanları
  formData = {
    name: '', 
    phone: '',
    address: '', 
    storeId: ''
  };

  constructor(
    private readonly productCompaniesService: ProductCompaniesService,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    super(platformId);
  }

  ngOnInit(): void {
    this.isLoading = false; // Başlangıçta loading'i false yap
    this.loadTenantAndStore();
    this.loadProductCompanies();
  }

  private loadTenantAndStore(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.formData.storeId = localStorage.getItem('selected_store') || '';
    }
  }

  loadProductCompanies(): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Force UI update to show loading state
    
    // Browser kontrolü yap
    let tenantId = this.currentTenantId;
    let storeId = this.currentStoreId;
    
    if (this.isBrowser()) {
      tenantId = tenantId || localStorage.getItem('tenant_id') || '';
      storeId = storeId || localStorage.getItem('selected_store') || '';
    }
    
    console.log('=== Loading companies with IDs ===', { tenantId, storeId });
    
    this.productCompaniesService.getAllProductCompanies({
      tenantId: tenantId,
      storeId: storeId
    }).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.productCompanies = response.data;
        } else {
          console.error('Ürün firmaları yüklenemedi:', response.message);
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update to hide loading state
      },
      error: (error) => {
        console.error('Ürün firmaları yüklenirken hata:', error);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update to hide loading state
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update to hide loading state
      }
    });
  }

  onCreateCompany(): void {
    this.isLoading = false; // Form açılırken loading'i kapat
    this.isCreating = true;
    this.selectedCompany = null;
    this.isEditing = false;
    
    // Store ID'yi güvenli şekilde al
    let storeId = this.currentStoreId;
    if (this.isBrowser()) {
      storeId = storeId || localStorage.getItem('selected_store') || '';
    }
    
    this.formData = {
      name: '',
      phone: '',
      address: '',
      storeId: storeId
    };
    this.cdr.detectChanges(); // UI'ı hemen güncelle
  }

  onEditCompany(company: ProductCompany): void {
    this.isEditing = true;
    this.isCreating = false;
    this.selectedCompany = company;
    
    // Form'u mevcut verilerle doldur
    this.formData = {
      name: company.name, 
      phone: company.phone || '',
      address: company.address || '',  
      storeId: company.storeId
    };
  }

  onSaveCompany(): void {
    if (!this.formData.name?.trim()) {
      alert('Firma adı zorunludur!');
      return;
    }

    if (!this.formData.phone?.trim()) {
      alert('Telefon numarası zorunludur!');
      return;
    }

    if (!this.formData.address?.trim()) {
      alert('Adres zorunludur!');
      return;
    }

    if (this.isCreating) {
      this.createCompany();
    } else if (this.isEditing) {
      this.updateCompany();
    }
  }

  private createCompany(): void {
    // Store ID'yi güvenli şekilde ata
    if (this.isBrowser()) {
      this.formData.storeId = this.currentStoreId || localStorage.getItem('selected_store') || '';
    } else {
      this.formData.storeId = this.currentStoreId || '';
    }
    
    this.productCompaniesService.createProductCompany(this.formData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          alert(response.message || 'Firma başarıyla oluşturuldu!');
          this.cancelForm();
          this.loadProductCompanies();
        } else {
          alert('Firma oluşturulamadı: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Firma oluşturulurken hata:', error);
        alert('Firma oluşturulurken hata oluştu!');
      }
    });
  }

  private updateCompany(): void {
    if (!this.selectedCompany) return;

    const updateCommand: UpdateProductCompanyCommand = {
      id: this.selectedCompany.id,
      name: this.formData.name ?? "",
      phone: this.formData.phone ?? "",
      address: this.formData.address ?? "",
      isActive: this.selectedCompany.isActive,
      tenantId: this.currentTenantId,
      storeId: this.currentStoreId
    };

    this.productCompaniesService.updateProductCompany(updateCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          alert('Firma başarıyla güncellendi!');
          this.cancelForm();
          this.loadProductCompanies();
        } else {
          alert('Firma güncellenemedi: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Firma güncellenirken hata:', error);
        alert('Firma güncellenirken hata oluştu!');
      }
    });
  }

  onDeleteCompany(company: any): void {
    if (!confirm(`"${company.name}" firmasını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    const deleteCommand= {
      id: company.id, 
      tenantId: company.tenantId,
      storeId: company.storeId
    };
    this.productCompaniesService.deleteProductCompany( deleteCommand
    ).subscribe({
      next: () => {
        alert('Firma başarıyla silindi!');
        this.loadProductCompanies();
      },
      error: (error) => {
        console.error('Firma silinirken hata:', error);
        alert('Firma silinirken hata oluştu!');
      }
    });
  }

  cancelForm(): void {
    this.isCreating = false;
    this.isEditing = false;
    this.selectedCompany = null;
    this.formData = {
      name: '',
      phone: '',
      address: '',
      storeId: this.formData.storeId
    };
  }

  toggleCompanyStatus(company: ProductCompany): void {
    const updateCommand: UpdateProductCompanyCommand = {
      id: company.id,
      name: company.name ?? "",
      description: company.description ?? "",
      phone: company.phone ?? "",
      email: company.email ?? "",
      address: company.address ?? "",
      taxNumber: company.taxNumber ?? "",
      taxOffice: company.taxOffice ?? "",
      isActive: !company.isActive,
      tenantId: company.tenantId,
      storeId: company.storeId
    };

    this.productCompaniesService.updateProductCompany(updateCommand).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          company.isActive = !company.isActive;
          alert(`Firma başarıyla ${company.isActive ? 'pasif' : 'aktif'} hale getirildi!`);
        } else {
          alert('Durum güncellenemedi: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Durum güncellenirken hata:', error);
        alert('Durum güncellenirken hata oluştu!');
      }
    });
  }
}
