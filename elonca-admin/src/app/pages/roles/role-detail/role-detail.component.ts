import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent } from '../../../core/base.component';

import { 
  Permission, 
  PermissionCategory, 
  mockPermissions, 
  mockPermissionCategories, 
  mockRolePermissions 
} from '../../../models/role-new.model';
import { RolesService, Role } from '../roles.service';

@Component({
  selector: 'app-role-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent extends BaseComponent implements OnInit {
  roleId: number = 0;
  role: Role | null = null;
  permissions: Permission[] = mockPermissions;
  categories: PermissionCategory[] = mockPermissionCategories;
  rolePermissions: string[] = [];
  selectedPermissions: { [key: string]: boolean } = {};
  isLoading = false; 

  constructor(
     @Inject(PLATFORM_ID) platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private rolesService: RolesService
  ) {super(platformId);}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roleId = +params['id'];
      this.loadRole();
      this.loadRolePermissions();
    });
  }

  loadRole(): void {
    this.isLoading = true;
    
    // API'den rolü getir
    this.rolesService.getAll({ storeId: this.currentStoreId }).subscribe({
      next: (response) => {
        console.log('Rol yüklendi:', response);
        this.role = response.data|| null;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Rol yüklenirken hata:', error);
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  loadRolePermissions(): void {
    // Get role permissions from mock data
    this.rolePermissions = mockRolePermissions[this.roleId] || [];
    
    // Initialize selected permissions
    this.permissions.forEach(permission => {
      this.selectedPermissions[permission.id] = this.rolePermissions.includes(permission.id);
    });
  }

  togglePermission(permissionId: string): void {
    this.selectedPermissions[permissionId] = !this.selectedPermissions[permissionId];
  }

  savePermissions(): void {
    const grantedPermissions = Object.keys(this.selectedPermissions)
      .filter(id => this.selectedPermissions[id]);
    
    console.log('Saving permissions for role', this.roleId, ':', grantedPermissions);
    // TODO: Call API to save permissions
    
    alert('Yetkiler başarıyla kaydedildi!');
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  getPermissionsByCategory(categoryId: string): Permission[] {
    return this.permissions.filter(p => p.category === categoryId);
  }

  isAllPermissionsSelected(categoryId: string): boolean {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    return categoryPermissions.every(p => this.selectedPermissions[p.id]);
  }

  isSomePermissionsSelected(categoryId: string): boolean {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    const selectedCount = categoryPermissions.filter(p => this.selectedPermissions[p.id]).length;
    return selectedCount > 0 && selectedCount < categoryPermissions.length;
  }

  toggleAllPermissions(categoryId: string): void {
    const categoryPermissions = this.getPermissionsByCategory(categoryId);
    const allSelected = this.isAllPermissionsSelected(categoryId);
    
    categoryPermissions.forEach(permission => {
      this.selectedPermissions[permission.id] = !allSelected;
    });
  }

  getSelectedCount(): number {
    return Object.values(this.selectedPermissions).filter(selected => selected).length;
  }

  getTotalCount(): number {
    return this.permissions.length;
  }

  trackByCategoryId(index: number, category: any): string {
    return category.id;
  }

  trackByPermissionId(index: number, permission: any): string {
    return permission.id;
  }
}
