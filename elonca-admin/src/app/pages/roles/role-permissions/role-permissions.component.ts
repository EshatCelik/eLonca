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
import { RolesService, Role, RolePermissionsResponse } from '../roles.service';

interface PermissionsResponse {
  permissions: Permission[];
  categories: PermissionCategory[];
  rolePermissions: string[];
}

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.scss']
})
export class RolePermissionsComponent extends BaseComponent implements OnInit {
  roleId: number = 0;
  role: Role | null = null;
  permissions: Permission[] = [];
  categories: PermissionCategory[] = [];
  rolePermissions: string[] = [];
  selectedPermissions: { [key: string]: boolean } = {};
  isLoading = true;
  roleStoreId = 1;
  isSaving = false;

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
      console.log('Role permissions sayfası açılıyor, roleId:', this.roleId);
      this.loadRole();
      this.loadPermissions();
    });
  }

  loadRole(): void {
    this.isLoading = true;
    this.rolesService.getRoleById(this.roleId).subscribe({
      next: (role: Role) => {
        this.role = role;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Rol yüklenirken hata oluştu:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.rolesService.getRolePermissions(this.roleId).subscribe({
      next: (response: RolePermissionsResponse) => {
        this.permissions = response?.permissions ?? [];
        this.categories = response?.categories ?? [];
        this.rolePermissions = response?.rolePermissions ?? [];

        this.initializeSelectedPermissions();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('İzinler yüklenirken hata oluştu:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  initializeSelectedPermissions(): void {
    this.selectedPermissions = {};
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
    this.isSaving = true;
    this.rolesService.updateRolePermissions(this.roleId, grantedPermissions).subscribe({
      next: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
        alert('Yetkiler başarıyla kaydedildi!');
      },
      error: (error: unknown) => {
        console.error('Yetkiler kaydedilirken hata:', error);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin', 'roles']);
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
