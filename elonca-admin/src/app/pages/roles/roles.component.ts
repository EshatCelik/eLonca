import { Component, OnInit, ChangeDetectorRef , Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService, Role, CreateRoleRequest } from './roles.service';
import { BaseComponent } from '../../core/base.component';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent extends BaseComponent  implements OnInit {
  roles: Role[] = [];
  isLoading = false; 
  showCreateModal = false;
  newRole: any = {
    name: '',
    code: '',
    storeId: 1
  };
  isCreating = false; 

  constructor(
     @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private rolesService: RolesService,
    private baseComponent :BaseComponent
  ) {super(platformId);}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    debugger
    // API'den rolleri getir
    this.rolesService.getAll({ storeId: this.currentStoreId }).subscribe({
      next: (response) => {
        console.log('Roller yüklendi:', response);
        this.roles = response.roles;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Roller yüklenirken hata:', error);
        this.isLoading = false; 
         
        this.cdr.detectChanges();
      }
    });
  }

  goToRolePermissions(roleId: number): void {
    console.log('goToRolePermissions çağrıldı, roleId:', roleId);
    console.log('Navigating to:', ['/admin', 'roles', roleId, 'permissions']);
    this.router.navigate(['/admin', 'roles', roleId, 'permissions']);
  }
 

  getRoleIcon(roleName: string): string {
    const icons: { [key: string]: string } = {
      'Yönetici': 'fa-user-shield',
      'Mağaza Sorumlusu': 'fa-store',
      'Satış Sorumlusu': 'fa-cash-register'
    };
    return icons[roleName] || 'fa-user';
  }

  trackByRoleId(index: number, role: any): number {
    return role.id;
  }
 


  openCreateModal(): void {
    this.showCreateModal = true;
    this.newRole = {
      name: '',
      code: '',
      storeId: 1
    };
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newRole = {
      name: '',
      code: '',
      storeId: 1
    }
  }

  createRole(): void {
    if (!this.newRole.name || !this.newRole.code) {
      alert('Lütfen rol adı ve kodu girin!');
      return;
    }

    this.isCreating = true;
    this.newRole.storeId=this.currentStoreId
    this.rolesService.create(this.newRole).subscribe({
      next: (response) => {
        console.log('Rol oluşturuldu:', response);
        this.isCreating = false;
        this.closeCreateModal();
        this.loadRoles(); // Rolleri yeniden yükle
        alert('Rol başarıyla oluşturuldu!');
      },
      error: (error) => {
        console.error('Rol oluşturulurken hata:', error);
        this.isCreating = false;
        alert('Rol oluşturulurken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    });
  }
}